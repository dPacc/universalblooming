#!/usr/bin/env python3
"""
Mirror a local build folder to a directory on the Hostinger FTP account.

  python3 scripts/deploy-ftp.py <local_dir> <remote_dir> [--prune]

Credentials come from the environment (FTP_HOST, FTP_USER, FTP_PASS), falling
back to a netrc file given by NETRC=path, so they never appear on a command line.
The FTP account is chrooted to public_html, so remote_dir is relative to it
("preview" for the subdomain, "." for the main site).

--prune deletes remote files/folders that are not in the build, but ONLY inside
remote_dir, and refuses to prune "." unless UB_ALLOW_ROOT_PRUNE=1 (so a slip
can never wipe the main site).
"""
import ftplib
import netrc
import os
import sys
from pathlib import Path


def creds():
    host, user, pw = os.environ.get("FTP_HOST"), os.environ.get("FTP_USER"), os.environ.get("FTP_PASS")
    if host and user and pw:
        return host, user, pw
    path = os.environ.get("NETRC")
    if not path:
        sys.exit("set FTP_HOST/FTP_USER/FTP_PASS or NETRC=/path/to/netrc")
    n = netrc.netrc(path)
    host = n.hosts and next(iter(n.hosts))
    user, _, pw = n.authenticators(host)
    return host, user, pw


def ensure_dir(ftp, path):
    parts = [p for p in path.strip("/").split("/") if p and p != "."]
    cur = ""
    for p in parts:
        cur = f"{cur}/{p}" if cur else p
        try:
            ftp.mkd(cur)
        except ftplib.error_perm:
            pass  # exists


def remote_tree(ftp, root):
    """Return (files, dirs) under root using MLSD."""
    files, dirs = set(), set()

    def walk(d):
        try:
            entries = list(ftp.mlsd(d, facts=["type"]))
        except ftplib.error_perm:
            return
        for name, facts in entries:
            if name in (".", ".."):
                continue
            path = f"{d}/{name}" if d not in ("", ".") else name
            if facts.get("type") == "dir":
                dirs.add(path)
                walk(path)
            elif facts.get("type") == "file":
                files.add(path)

    walk(root)
    return files, dirs


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    prune = "--prune" in sys.argv
    if len(args) != 2:
        sys.exit(__doc__)
    local, remote = Path(args[0]), args[1].strip("/") or "."
    if prune and remote == "." and os.environ.get("UB_ALLOW_ROOT_PRUNE") != "1":
        sys.exit("refusing to prune the site root without UB_ALLOW_ROOT_PRUNE=1")

    host, user, pw = creds()
    ftp = ftplib.FTP(host, timeout=60)
    ftp.login(user, pw)
    ftp.set_pasv(True)
    ensure_dir(ftp, remote)

    local_files = sorted(p for p in local.rglob("*") if p.is_file())
    wanted = set()
    for i, p in enumerate(local_files, 1):
        rel = p.relative_to(local).as_posix()
        target = rel if remote == "." else f"{remote}/{rel}"
        wanted.add(target)
        ensure_dir(ftp, str(Path(target).parent))
        with open(p, "rb") as fh:
            ftp.storbinary(f"STOR {target}", fh)
        if i % 50 == 0 or i == len(local_files):
            print(f"  uploaded {i}/{len(local_files)}")

    if prune:
        files, dirs = remote_tree(ftp, remote)
        stale = sorted(files - wanted)
        for f in stale:
            ftp.delete(f)
        for d in sorted(dirs, key=lambda x: -x.count("/")):
            if not any(w.startswith(d + "/") for w in wanted):
                try:
                    ftp.rmd(d)
                except ftplib.error_perm:
                    pass
        print(f"  pruned {len(stale)} stale files")

    ftp.quit()
    print(f"deployed {len(local_files)} files to /{remote}")


if __name__ == "__main__":
    main()
