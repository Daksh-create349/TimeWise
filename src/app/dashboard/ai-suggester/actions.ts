"use server";

export async function getCourseSuggestions(
  prevState: any,
  formData: FormData
) {
  const topic = formData.get("topic");

  if (!topic || typeof topic !== "string" || topic.length < 10) {
    return { data: null, error: "Please provide a more detailed topic." };
  }

  // This is where you would call your Genkit flow.
  // import { aiCourseSuggestion } from '@/ai/flows/ai-course-suggestion';
  // const result = await run(aiCourseSuggestion, { topic, studentData: ... });

  // For demonstration, we'll return mock data after a delay.
  await new Promise(resolve => setTimeout(resolve, 1500));

  const mockData = {
    summary: "Based on your interest in machine learning and sustainable farming, here is a personalized academic and career plan designed to merge these two fields effectively.",
    suggested_courses: [
      {
        course_code: "CS488",
        course_name: "Introduction to Artificial Intelligence",
        reason: "Provides foundational knowledge of AI and machine learning, essential for your project."
      },
      {
        course_code: "AGR320",
        course_name: "Precision Agriculture Technology",
        reason: "Directly applies technology concepts, including data analysis and automation, to farming."
      },
      {
        course_code: "ENV250",
        course_name: "Sustainable Resource Management",
        reason: "Offers context on sustainability that will inform the purpose and features of your app."
      }
    ],
    learning_resources: {
      books: [
        {
          title: "Hands-On Machine Learning with Scikit-Learn, Keras & TensorFlow",
          author: "Aurélien Géron",
          reason: "A practical guide to implementing ML models, perfect for a hands-on project."
        },
        {
          title: "The Lean Farm: How to Minimize Waste, Increase Efficiency, and Maximize Value and Profits with Less Work",
          author: "Ben Hartman",
          reason: "Provides insight into the efficiency and sustainability principles in modern farming."
        }
      ],
      websites: [
        {
          name: "Coursera: Machine Learning by Andrew Ng",
          url: "https://www.coursera.org/learn/machine-learning",
          reason: "The definitive introductory course on ML, taught by a pioneer in the field."
        },
        {
          name: "Towards Data Science",
          url: "https://towardsdatascience.com/",
          reason: "A Medium publication with countless articles on practical AI/ML applications, including in agriculture."
        }
      ]
    },
    study_strategies: [
      "Start with a small-scale project, like a simple plant watering sensor that collects data.",
      "Join the university's 'Code for Good' club to find peers with similar interests.",
      "Schedule a meeting with Professor Evans from the Agriculture department to discuss your idea; his research is in agri-tech."
    ]
  };

  return { data: mockData, error: null };
}
