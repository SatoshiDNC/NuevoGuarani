#!/bin/bash

# Calculates the total time each dev contributed to the current git repo.
#
# Design:
#
# 1. Commits with less than 15 minutes between form a contiguous block of time
#    (an arbitrary cutoff heuristically determined).
#
# 2. Lonely commits are worth at least as much as the time in point (1).
#
# 3. For commits longer than 15 minutes, time spent can be manually indicated
#    with the first word in the commit subject line, using one of the following
#    two formats:
#
#     * 1.5h would signify one and a half hours spent on this (and any
#       overlapping prior) commits.
#
#     * 90m would also signify one and a half hours. In both cases, the final
#       results of the calculation are aways printed in seconds.

TIMELOG=timelog.tmp
CONTIGUITY_SECONDS=900 # 15 minutes

JSON_OUT=$1
if [ "$JSON_OUT" == "" ]; then
  JSON_OUT=timecalc.json
fi

git log --first-parent --pretty=%at%x20%an%x20%aE%x20%s >$TIMELOG

echo
num_devs=`cut -d' ' -f2,3 <"$TIMELOG"|sort|uniq|wc -l`
unique_devs=(`cut -d' ' -f2,3 <"$TIMELOG"|sort|uniq`)
totals=()
echo "Calculating time contributed by $num_devs devs:"

total_time_spent=0
: > $JSON_OUT
echo "[" >> $JSON_OUT
for ((i = 0; i < ${#unique_devs[@]}; i+=2)); do
  dev="${unique_devs[i]}"
  addr="${unique_devs[i+1]}"
  time_spent=0
  coveredto=
  coveredfrom=
  while IFS= read -r line; do
    fields=(`echo "$line"`)
    if [ "${fields[1]} ${fields[2]}" == "$dev $addr" ]; then
      timestamp="${fields[0]}"
      infocode="${fields[3]}"

      # Get the time spent indicated by the dev (hours or minutes, not both)
      devhours=`echo "$infocode"|sed -e '/^[.0-9]*h$/ ! s/.*//' -e 's/\([.0-9]*\)h/\1/'`
      devmins=`echo "$infocode"|sed -e '/^[.0-9]*m$/ ! s/.*//' -e 's/\([.0-9]*\)m/\1/'`

      # Convert it to seconds
      devhours_insecs=`awk -vp=$devhours -vq=3600 'BEGIN{printf "%d" ,p * q}'`
      devmins_insecs=`awk -vp=$devmins -vq=60 'BEGIN{printf "%d" ,p * q}'`
      devdur=$(( devhours_insecs + devmins_insecs ))

      # Clamp to the minimum
      devdur=$(( CONTIGUITY_SECONDS > devdur ? CONTIGUITY_SECONDS : devdur ))

      # Establish how far back we're accounted for, if needed
      if [ "$coveredfrom" == "" ]; then
        coveredto=$timestamp
        coveredfrom=$(( timestamp - devdur ))
      fi

      # Extend coverage if we're still in the same coverage period
      if [ "$timestamp" -ge "$coveredfrom" ] && [ "$timestamp" -le "$coveredto" ]; then
        from=$(( timestamp - devdur ))
        coveredfrom=$(( from < coveredfrom ? from : coveredfrom))
      fi

      # If this commit falls outside the existing coverage period, add and reset
      if [ "$timestamp" -lt "$coveredfrom" ]; then
        time_spent=$(( time_spent + (coveredto - coveredfrom) ))
        coveredto=$timestamp
        coveredfrom=$(( timestamp - devdur ))
      fi

    fi
  done < "$TIMELOG"

  # Add the last/running coverage period
  time_spent=$(( time_spent + (coveredto - coveredfrom) ))

  # Print progress
  dev_num=$((i/2+1))
  echo "$dev_num. $time_spent $dev $addr"

  # Build the JSON
  if [ $dev_num -lt $num_devs ]; then
    comma=","
  else
    comma=""
  fi
  echo "{time_secs:$time_spent,dev_nym:\"$dev\",lightning_address:\"$addr\"}$comma" >> $JSON_OUT

  totals+=($time_spent)
  total_time_spent=$(( total_time_spent + time_spent ))
done
echo "]" >> $JSON_OUT

# Print summary
echo $total_time_spent total
echo
for ((i = 0; i < ${#unique_devs[@]}; i+=2)); do
  time_spent="${totals[i/2]}"
  echo "$(( 100 * time_spent / total_time_spent ))% ${unique_devs[i]}"
done

rm $TIMELOG
