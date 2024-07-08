#!/bin/bash

MONGOSH="mongosh ${MONGODB_URI}"

JS_CODE="
  db.courses.drop()
  db.sections.drop()
  db.lectures.drop()

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
"

echo "-- Creating and Populating 'Course' and 'Section' collections..."
${MONGOSH} --eval "${JS_CODE}" > /dev/null

echo "-- Creating and Populating 'Lecture' collections..."
course_id=$(${MONGOSH} --eval "db.courses.findOne({ slug: 'fullstack-web-dev' })._id")
${MONGOSH} --eval "db.createCollection('lectures')" > /dev/null
for i in {0..4}; do
  section_id=$(${MONGOSH} --eval "db.sections.findOne({ section_num: ${i} })._id")
  j=1
  for f in $(ls -1 data/section_${i}-lecture_*.md); do
    content=$(cat "$f" | sed 's/[\\"]/\\&/g' | awk '{printf "%s\\n", $0}')

    title=$(head -n 1 $f | sed 's/# //')

    ${MONGOSH} --eval "
      db.lectures.insertOne({
        course_id: ${course_id},
        section_id: ${section_id},
        lecture_num: ${j},
        title: '${title}',
        description: 'A lecture',
        slug: 'lecture-${j}',
        content: \"${content}\",
        tags: ['tag1', 'tag2'],
        video_url: 'https://www.youtube.com/live/_uMuuHk_KkQ?si=IKOwNtlIkuX-orJC',
      })
    " > /dev/null
    j=$((j + 1))
  done
done
