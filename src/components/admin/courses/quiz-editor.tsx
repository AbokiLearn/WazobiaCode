import { Plus, Trash2, X } from 'lucide-react';
import { useState, useEffect } from 'react';

import {
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

import { getAssignment } from '@/lib/client/assignment';
import { AssignmentType } from '@/types/db/assignment';
import { ILecture } from '@/types/db/course';

interface QuizQuestion {
  _id?: string;
  question: string;
  options: string[];
  correct_answer: number;
  points: number;
}

interface QuizAssignment {
  _id?: string;
  course_id: string;
  section_id: string;
  lecture_id: string;
  type: AssignmentType;
  tags: string[];
  max_score: number;
  due_date: Date;
  active_date: Date;
}

export const QuizEditorTab = ({
  lecture,
  saveQuiz,
}: {
  lecture: ILecture;
  saveQuiz: (quiz_id: string, quiz: QuizAssignment) => Promise<any>;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeDate, setActiveDate] = useState('');
  const [maxScore, setMaxScore] = useState(10);
  const [dueDate, setDueDate] = useState('');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toISOString().slice(0, 16);
  };

  useEffect(() => {
    const fetchQuiz = async () => {
      if (lecture.quiz_id) {
        try {
          const { assignment: quizData } = await getAssignment(
            lecture.quiz_id.toString(),
          );

          if (quizData) {
            setActiveDate(formatDate(quizData.active_date));
            setMaxScore(quizData.max_score || 10);
            setDueDate(formatDate(quizData.due_date));
            setQuestions(quizData.questions || []);
          }
        } catch (error) {
          console.error('Failed to fetch quiz data:', error);
        }
      }
    };
    fetchQuiz();
  }, [lecture.quiz_id]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!activeDate) newErrors.activeDate = 'Active date is required';
    if (!maxScore || maxScore <= 0)
      newErrors.maxScore = 'Max score must be a positive number';
    if (!dueDate) newErrors.dueDate = 'Due date is required';
    if (questions.length === 0)
      newErrors.questions = 'At least one question is required';

    questions.forEach((question, index) => {
      if (!question.question.trim())
        newErrors[`question_${index}`] = 'Question text is required';
      if (question.options.length < 2)
        newErrors[`question_${index}_options`] =
          'At least two options are required';
      if (question.correct_answer === -1)
        newErrors[`question_${index}_correct`] =
          'A correct answer must be selected';

      question.options.forEach((option, optionIndex) => {
        if (!option.trim())
          newErrors[`question_${index}_option_${optionIndex}`] =
            'Answer text is required';
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: '', options: ['', ''], correct_answer: -1, points: 1 },
    ]);
  };

  const updateQuestion = (index: number, question: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].question = question;
    setQuestions(updatedQuestions);
  };

  const updateAnswer = (
    questionIndex: number,
    answerIndex: number,
    answer: string,
  ) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[answerIndex] = answer;
    setQuestions(updatedQuestions);
  };

  const toggleCorrectAnswer = (questionIndex: number, answerIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].correct_answer = answerIndex;
    setQuestions(updatedQuestions);
  };

  const addAnswer = (questionIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.push('');
    setQuestions(updatedQuestions);
  };

  const removeAnswer = (questionIndex: number, answerIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.splice(answerIndex, 1);
    if (updatedQuestions[questionIndex].correct_answer === answerIndex) {
      updatedQuestions[questionIndex].correct_answer = -1;
    }
    setQuestions(updatedQuestions);
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
  };

  const onSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      if (!lecture.quiz_id) throw new Error('Quiz ID is required');
      const quizData = {
        questions,
        type: AssignmentType.QUIZ,
        active_date: new Date(activeDate),
        max_score: maxScore,
        due_date: new Date(dueDate),
        course_id: lecture.course_id.toString(),
        section_id: lecture.section_id.toString(),
        lecture_id: lecture._id.toString(),
        tags: lecture.tags || [],
      };
      await saveQuiz(lecture.quiz_id.toString(), quizData);
    } catch (error) {
      console.error('Failed to save quiz:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <TabsContent value="quiz">
      <CardHeader className="flex flex-row justify-between items-center">
        <div>
          <CardTitle>Quiz</CardTitle>
          <CardDescription className="text-md mt-2">
            Edit the quiz for the lecture, &quot;{lecture?.title}&quot;
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="h-[calc(80vh-200px)] flex flex-col">
        <div className="mb-6 space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label
                htmlFor="activeDate"
                className="block text-sm font-medium text-gray-700"
              >
                Active Date
              </label>
              <Input
                id="activeDate"
                type="datetime-local"
                value={activeDate}
                onChange={(e) => setActiveDate(e.target.value)}
              />
              {errors.activeDate && (
                <p className="text-red-500 text-sm mt-1">{errors.activeDate}</p>
              )}
            </div>
            <div className="flex-1">
              <label
                htmlFor="maxScore"
                className="block text-sm font-medium text-gray-700"
              >
                Max Score
              </label>
              <Input
                id="maxScore"
                type="number"
                value={maxScore}
                onChange={(e) => setMaxScore(Number(e.target.value))}
              />
              {errors.maxScore && (
                <p className="text-red-500 text-sm mt-1">{errors.maxScore}</p>
              )}
            </div>
            <div className="flex-1">
              <label
                htmlFor="dueDate"
                className="block text-sm font-medium text-gray-700"
              >
                Due Date
              </label>
              <Input
                id="dueDate"
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
              {errors.dueDate && (
                <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>
              )}
            </div>
          </div>
        </div>
        <div className="flex-grow overflow-y-auto pr-4">
          <div className="max-w-4xl mx-auto space-y-6">
            {questions.map((question, index) => (
              <Card key={index} className="border-b">
                <CardContent className="space-y-4 py-6">
                  <div className="flex gap-4 justify-between items-center">
                    <h1 className="text-lg font-bold">Question {index + 1}</h1>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeQuestion(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-col">
                    <Textarea
                      value={question.question}
                      onChange={(e) => updateQuestion(index, e.target.value)}
                      className="w-full resize-none"
                      rows={3}
                      placeholder="Enter your question (supports Markdown)"
                    />
                    {errors[`question_${index}`] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[`question_${index}`]}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    {question.options.map((option, answerIndex) => (
                      <div
                        key={answerIndex}
                        className="flex items-center gap-2 border-b border-muted"
                      >
                        <Checkbox
                          checked={question.correct_answer === answerIndex}
                          onCheckedChange={() =>
                            toggleCorrectAnswer(index, answerIndex)
                          }
                        />
                        <Input
                          value={option}
                          onChange={(e) =>
                            updateAnswer(index, answerIndex, e.target.value)
                          }
                          placeholder={`Answer ${answerIndex + 1}`}
                          className="border-none"
                          required
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeAnswer(index, answerIndex)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    {errors[`question_${index}_options`] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[`question_${index}_options`]}
                      </p>
                    )}
                    {errors[`question_${index}_correct`] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[`question_${index}_correct`]}
                      </p>
                    )}
                    {question.options.map(
                      (_, optionIndex) =>
                        errors[`question_${index}_option_${optionIndex}`] && (
                          <p
                            key={optionIndex}
                            className="text-red-500 text-sm mt-1"
                          >
                            {errors[`question_${index}_option_${optionIndex}`]}
                          </p>
                        ),
                    )}
                    <Button
                      variant="outline"
                      className="w-full mt-4 hover:bg-background hover:text-accent"
                      onClick={() => addAnswer(index)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Answer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <div className="flex justify-between mt-4">
          <Button onClick={addQuestion}>
            <Plus className="w-4 h-4 mr-2" />
            Add Question
          </Button>
          <Button onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Quiz'}
          </Button>
        </div>
      </CardContent>
    </TabsContent>
  );
};
