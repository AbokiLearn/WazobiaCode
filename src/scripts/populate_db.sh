#!/bin/bash

SCRIPTS_DIR=$(dirname "$0")
OWD=$(pwd)

cd "${SCRIPTS_DIR}"

MONGOSH="mongosh ${MONGODB_URI}"

JS_CODE="
  db.courses.drop()
  db.sections.drop()
  db.lectures.drop()
  db.assignments.drop()
  db.studentquestions.drop()

  db.createCollection('courses')
  const courseIds = db.courses.insertMany([
    {
      title: 'Full-Stack Web Development',
      icon: 'https://images-dev-public.s3.amazonaws.com/course-resources/fullstack-web-dev/icons/course-icon.svg',
      description: '6-week bootcamp focused on full-stack web development',
      slug: 'fullstack-web-dev',
      active: true,
      cover_image:
        'https://images-dev-public.s3.amazonaws.com/course-resources/data-science-python/cover-image.png',
    },
    {
      title: 'Data Science with Python',
      icon: 'https://images-dev-public.s3.amazonaws.com/course-resources/data-science-python/icons/course-icon.svg',
      description: '6-week bootcamp focused on data science with Python',
      slug: 'data-science-python',
      active: false,
      coverImage:
        'https://images-dev-public.s3.amazonaws.com/course-resources/data-science-python/cover-image.png',
    }
  ]).insertedIds

  db.createCollection('sections')
  const sectionIds = db.sections.insertMany([
    {
      course_id: courseIds[0],
      section_num: 0,
      title: 'Getting Started',
      description: 'Getting started with Replit',
      slug: 'getting-started',
      icon: 'https://images-dev-public.s3.amazonaws.com/course-resources/fullstack-web-dev/icons/section-0-icon.svg',
    },
    {
      course_id: courseIds[0],
      section_num: 1,
      title: 'Web Development Fundamentals',
      description: 'An introduction to HTML, CSS, and JavaScript',
      slug: 'web-dev-fundamentals',
      icon: 'https://images-dev-public.s3.amazonaws.com/course-resources/fullstack-web-dev/icons/section-1-icon.svg',
    },
    {
      course_id: courseIds[0],
      section_num: 2,
      title: 'Frontend Development with React.js',
      description: 'An introduction to React.js',
      slug: 'frontend-dev-react',
      icon: 'https://images-dev-public.s3.amazonaws.com/course-resources/fullstack-web-dev/icons/section-2-icon.svg',
    },
    {
      course_id: courseIds[0],
      section_num: 3,
      title: 'Backend Development with Express.js',
      description: 'An introduction to Express.js',
      slug: 'backend-dev-express',
      icon: 'https://images-dev-public.s3.amazonaws.com/course-resources/fullstack-web-dev/icons/section-3-icon.svg',
    },
    {
      course_id: courseIds[0],
      section_num: 4,
      title: 'Introduction to DevOps',
      description: 'An introduction to DevOps',
      slug: 'intro-to-devops',
      icon: 'https://images-dev-public.s3.amazonaws.com/course-resources/fullstack-web-dev/icons/section-4-icon.svg',
    },
    {
      course_id: courseIds[1],
      section_num: 0,
      title: 'Getting Started',
      description: 'Getting started with Replit',
      slug: 'getting-started',
      icon: 'https://images-dev-public.s3.amazonaws.com/course-resources/fullstack-web-dev/icons/section-0-icon.svg',
    },
    {
      course_id: courseIds[1],
      section_num: 1,
      title: 'Python Programming Fundamentals',
      description: 'An introduction to Python programming',
      slug: 'python-fundamentals',
      icon: 'https://images-dev-public.s3.amazonaws.com/course-resources/data-science-python/icons/section-1-icon.svg',
    },
    {
      course_id: courseIds[1],
      section_num: 2,
      title: 'Introduction to Machine Learning',
      description: 'An introduction to machine learning with scikit-learn',
      slug: 'intro-to-machine-learning',
      icon: 'https://images-dev-public.s3.amazonaws.com/course-resources/data-science-python/icons/section-2-icon.svg',
    },
  ]).insertedIds

  db.createCollection('lectures')
  db.createCollection('assignments')
  db.createCollection('studentquestions')
"

echo "-- Creating collections: courses, sections, lectures, assignments"
echo "-- Populating 'Course' and 'Section' collections..."
${MONGOSH} --eval "${JS_CODE}" > /dev/null

echo "-- Populating 'Lecture' and 'Assignment' collections..."
course_id=$(${MONGOSH} --eval "db.courses.findOne({ slug: 'fullstack-web-dev' })._id")
for i in {0..4}; do
  section_id=$(${MONGOSH} --eval "db.sections.findOne({ section_num: ${i} })._id")
  j=1

  for f in $(ls -1 data/section_${i}-lecture_*.md); do
    content=$(cat "$f" | sed 's/[\\"]/\\&/g' | awk '{printf "%s\\n", $0}')
    title=$(head -n 1 $f | sed 's/# //')

    lecture_id=$(${MONGOSH} --eval "
      db.lectures.insertOne({
        course_id: ${course_id},
        section_id: ${section_id},
        lecture_num: ${j},
        title: '${title}',
        description: 'A lecture',
        slug: 'lecture-${j}',
        content: \"${content}\",
        tags: ['tag1', 'tag2'],
        video_url: 'https://www.youtube.com/watch?v=JphpuOcmUc4',
      }).insertedId
    ")

    quiz_id=$(${MONGOSH} --eval "
      db.assignments.insertOne({
        course_id: ${course_id},
        section_id: ${section_id},
        lecture_id: ${lecture_id},
        type: 'quiz',
        tags: ['tag1', 'tag2'],
        max_score: 10,
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        questions: [
          {
            _id: new ObjectId(),
            question: 'What is the capital of France?',
            options: ['London', 'Berlin', 'Paris', 'Madrid'],
            correct_answer: 2,
            points: 5,
          },
          {
            _id: new ObjectId(),
            question: 'Which programming language is this course about?',
            options: ['Java', 'Python', 'C++', 'JavaScript'],
            correct_answer: 3,
            points: 5,
          }
        ]
      }).insertedId
    ")

    homework_id=$(${MONGOSH} --eval "
      db.assignments.insertOne({
        course_id: ${course_id},
        section_id: ${section_id},
        lecture_id: ${lecture_id},
        type: 'homework',
        tags: ['tag1', 'tag2'],
        max_score: 10,
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        instructions: 'Complete the coding assignment as per the instructions in the lecture.',
        files: [
          'https://images-dev-public.s3.us-east-1.amazonaws.com/file-bin/73bf7450-4e8f-459a-938d-d6bf85cf6784.tsx',
          'https://images-dev-public.s3.us-east-1.amazonaws.com/file-bin/07c0322d-076a-4929-84a7-8d3c0184cfa4.sh'
        ]
      }).insertedId
    ")

    ${MONGOSH} --eval "
      db.lectures.updateOne(
        { _id: ${lecture_id} },
        { \$set: { quiz: ${quiz_id}, homework: ${homework_id} } }
      )
    " > /dev/null

    j=$((j + 1))
  done
done

echo "-- Done!"
cd "${OWD}"
