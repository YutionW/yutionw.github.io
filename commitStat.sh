#!/usr/bin/env sh
# encoding: utf-8

########################################################################
#	Copyright © 2021 OUC_LiuX, All rights reserved. 
#	File Name: commitStat.sh
#	Author: OUC_LiuX 	Mail:liuxiang@stu.ouc.edu.cn 
#	Version: V1.0.0 
#	Date: 2021-06-11 Fri 16:20
#	Description: 
#	History: 
########################################################################

git log  --author="OUCliuxiang" --format='%aN' | sort -u | while read name; do echo -en "$name\t"; git log --author="$name" --pretty=tformat:  --since ==2021-6-4 --until=2021-6-11 --numstat | gawk '{ add += $1; subs += $2; loc += $1 - $2 } END { printf "\n added lines: %s, \n removed lines: %s, \n total lines: %s\n", add, subs, loc }' -; done
