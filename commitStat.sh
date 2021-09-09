#!/usr/bin/env sh
# encoding: utf-8



git log  --author="OUC_WYC" --format='%aN' | sort -u | while read name; do echo -en "$name\t"; git log --author="$name" --pretty=tformat:  --since ==2021-6-4 --until=2021-6-11 --numstat | gawk '{ add += $1; subs += $2; loc += $1 - $2 } END { printf "\n added lines: %s, \n removed lines: %s, \n total lines: %s\n", add, subs, loc }' -; done
