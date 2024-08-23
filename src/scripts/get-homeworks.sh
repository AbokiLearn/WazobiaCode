#!/bin/bash

source /mnt/arrakis/ventures/wazobiacode/WazobiaCode/.env

mongosh $MONGODB_URI --eval '
const result = db.submissions.aggregate([
  {
    $lookup: {
      from: "lectures",
      localField: "lecture_id",
      foreignField: "_id",
      as: "lecture"
    }
  },
  {
    $unwind: "$lecture"
  },
  {
    $lookup: {
      from: "user_metadata",
      localField: "student_id",
      foreignField: "sub",
      as: "student"
    }
  },
  {
    $unwind: "$student"
  },
  {
    $lookup: {
      from: "submissions",
      localField: "_id",
      foreignField: "_id",
      as: "homework"
    }
  },
  {
    $unwind: {
      path: "$homework",
      preserveNullAndEmptyArrays: true
    }
  },
  {
    $project: {
      _id: 0,
      submission_id: { $toString: "$_id" },
      first_name: "$student.first_name",
      last_name: "$student.last_name",
      email: "$student.email",
      phone_number: "$student.phone_number",
      lecture_title: "$lecture.title",
      submitted_files: "$homework.submitted_files"
    }
  }
]).toArray();

JSON.stringify(result, null, 2)' --quiet | python -c "
import json
import csv
import sys

d=json.loads(sys.stdin.read())
w=csv.writer(sys.stdout)

columns = [
    'submission_id',
    'first_name',
    'last_name',
    'email',
    'phone_number',
    'lecture_title'
]

n_files = max(len(s['submitted_files']) for s in d)

w.writerow(
    columns + [
        f'submitted_file_{i+1}' for i in range(n_files)
    ]
)

[
    w.writerow(
        [ s[k] for k in columns ] +
        [
            s['submitted_files'][i]['file_name'] + '\n' + s['submitted_files'][i]['file_url'] if i < len(s['submitted_files']) else '' for i in range(n_files)
        ]
    ) for s in d
]"
