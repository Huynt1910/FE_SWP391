import { useQuery } from "@tanstack/react-query";
import { APIClient } from "@lib/api-client";
import { ACTIONS } from "@lib/api-client/constant";

export function useSurveyQuestions() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["surveyQuestions"],
    queryFn: async () => {
      const response = await APIClient.invoke({
        action: ACTIONS.GET_SURVEY_QUESTIONS,
      });
      return response.questions;
    },
  });

  return { questions: data, error, isLoading };
}
