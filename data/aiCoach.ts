import { getMasteryLevel } from "./mastery";

export function analyzePerformance(records: any[]) {

  const topicData: any = {};

  records.forEach((item) => {

    if (!topicData[item.topic]) {

      topicData[item.topic] = {
        total: 0,
        correct: 0,
      };

    }

    topicData[item.topic].total++;

    if (item.correct) {
      topicData[item.topic].correct++;
    }

  });

  const result = Object.keys(topicData).map((topic) => {

    const data = topicData[topic];

    const accuracy = Math.round(
      (data.correct / data.total) * 100
    );

    const mastery = getMasteryLevel(
      accuracy,
      0
    );

    return {

      topic,

      attempt: data.total,

      correct: data.correct,

      accuracy,

      status:
        accuracy < 70
          ? "Weak"
          : "Good",

      masteryLevel: mastery.level,

      masteryColor: mastery.color,

      masteryMessage: mastery.message,

    };

  });

  return result;

}