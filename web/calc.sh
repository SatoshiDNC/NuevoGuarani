#!/bin/bash

TIMELOG=timelog
WEIGHTS_OUT=devweights
CONTIGUITY_SECONDS=900

echo
num_devs=`cut -d' ' -f2,3 <"$TIMELOG"|sort|uniq|wc -l`
unique_devs=(`cut -d' ' -f2,3 <"$TIMELOG"|sort|uniq`)
totals=()
echo Calculating time contributed by $num_devs devs:
# for ((i = 0; i < ${#unique_devs[@]}; i+=2)); do
#   echo ${unique_devs[i]} ${unique_devs[i+1]}
# done
# echo

total_time_spent=0
:>$WEIGHTS_OUT
for ((i = 0; i < ${#unique_devs[@]}; i+=2)); do
  dev=${unique_devs[i]}
  addr=${unique_devs[i+1]}
  time_spent=0
  last_timestamp=
  prev_timestamp=
  prev_infocode=
  while IFS= read -r line; do
    fields=(`echo "$line"`)
    line_dev="${fields[1]} ${fields[2]}"
    if [ "$line_dev" == "$dev $addr" ]; then
      timestamp=${fields[0]}
      if [ "$prev_timestamp" != "" ]; then
        prev_infocode=${prev_infocode//debug/2h}
        devhours=`echo $prev_infocode|sed -e '/^[0-9]*h$/ ! s/.*//' -e 's/\([0-9]*\)h/\1/'`
        devmins=`echo $prev_infocode|sed -e '/^[0-9]*m$/ ! s/.*//' -e 's/\([0-9]*\)m/\1/'`
        prev_devdur=$(( (devhours * 60 + devmins) * 60 ))
        prev_devdur=$((CONTIGUITY_SECONDS>prev_devdur ? CONTIGUITY_SECONDS : prev_devdur))
        prev_delta=$(( prev_timestamp - timestamp ))
        last_delta=$(( last_timestamp - timestamp ))
        if [ "$prev_delta" -le "$prev_devdur" ] || ([ "$last_timestamp" != "" ] && [ "$last_delta" -le "$last_devdur" ]); then
          if [ "$last_timestamp" == "" ]; then
            last_timestamp=$prev_timestamp
            last_devdur=$prev_devdur
          fi
        else
          if [ "$last_timestamp" != "" ]; then
            time_spent=$(( time_spent + (last_timestamp - prev_timestamp) + $CONTIGUITY_SECONDS ))
            last_timestamp=
          else
            time_spent=$(( time_spent + $prev_devdur ))
          fi
        fi
      fi
      prev_timestamp=$timestamp
      prev_infocode=${fields[3]}
    fi
  done < "$TIMELOG"
  if [ "$last_timestamp" != "" ]; then
    time_spent=$(( time_spent + (last_timestamp - prev_timestamp) + $CONTIGUITY_SECONDS ))
    last_timestamp=
  else
    time_spent=$(( time_spent + $prev_devdur ))
  fi
  j=$((i/2+1))
  echo "$j. $time_spent $dev $addr"
  echo "$time_spent $dev $addr" >> $WEIGHTS_OUT
  totals+=($time_spent)
  total_time_spent=$(( total_time_spent + time_spent ))
done
echo $total_time_spent total
echo

for ((i = 0; i < ${#unique_devs[@]}; i+=2)); do
  time_spent="${totals[i/2]}"
  echo "$(( 100 * time_spent / total_time_spent ))% ${unique_devs[i]}"
done
