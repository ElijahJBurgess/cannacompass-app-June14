import { supabase } from '../supabaseClient';

type MatchReason = {
  criteria: string;
  score: number;
  explanation: string;
};

type ProductWithMatch = {
  id: string;
  name: string;
  effect: string;
  thc: string;
  description: string;
  image_url: string;
  experience_level?: string;
  method?: string;
  daypart?: string;
  cannabinoid_profile?: string;
  affiliate_url?: string;
  matchReasons: MatchReason[];
  matchScore: number;
};

const calculateMatchScore = (product: any, userAnswers: any): MatchReason[] => {
  const reasons: MatchReason[] = [];
  let totalScore = 0;

  // Effect match (highest weight)
  if (product.effect && userAnswers["1"] && product.effect.toLowerCase().includes(userAnswers["1"].toLowerCase())) {
    const score = 90;
    reasons.push({
      criteria: 'effect',
      score,
      explanation: `Perfect match for ${userAnswers["1"]} support`
    });
    totalScore += score;
  }

  // Experience level match
  if (product.experience_level && userAnswers["2"] && product.experience_level.toLowerCase().includes(userAnswers["2"].toLowerCase())) {
    const score = 80;
    reasons.push({
      criteria: 'experience',
      score,
      explanation: `Great for ${userAnswers["2"]} users`
    });
    totalScore += score;
  }

  // Method match
  if (product.method && userAnswers["3"] && product.method.toLowerCase().includes(userAnswers["3"].toLowerCase())) {
    const score = 85;
    reasons.push({
      criteria: 'method',
      score,
      explanation: `Matches your preferred ${userAnswers["3"]} method`
    });
    totalScore += score;
  }

  // Cannabinoid profile match
  if (product.cannabinoid_profile && userAnswers["5"] && product.cannabinoid_profile.toLowerCase().includes(userAnswers["5"].toLowerCase())) {
    const score = 75;
    reasons.push({
      criteria: 'cannabinoid',
      score,
      explanation: `Contains your preferred ${userAnswers["5"]} profile`
    });
    totalScore += score;
  }

  // Daypart match
  if (product.daypart && userAnswers["7"] && product.daypart.toLowerCase().includes(userAnswers["7"].toLowerCase())) {
    const score = 70;
    reasons.push({
      criteria: 'daypart',
      score,
      explanation: `Ideal for ${userAnswers["7"]} use`
    });
    totalScore += score;
  }

  return reasons;
};

export const getMatchingProducts = async (userAnswers: any): Promise<ProductWithMatch[]> => {
  const filters = [];

  if (userAnswers["1"]) filters.push({ column: 'effect', value: userAnswers["1"] });
  if (userAnswers["2"]) filters.push({ column: 'experience_level', value: userAnswers["2"] });
  if (userAnswers["3"]) filters.push({ column: 'method', value: userAnswers["3"] });
  if (userAnswers["4"]) filters.push({ column: 'use_context', value: userAnswers["4"] });
  if (userAnswers["5"]) filters.push({ column: 'cannabinoid_profile', value: userAnswers["5"] });
  if (userAnswers["7"]) filters.push({ column: 'daypart', value: userAnswers["7"] });

  let query = supabase.from('products').select('*');

  filters.forEach(filter => {
    query = query.ilike(filter.column, `%${filter.value}%`);
  });

  if (userAnswers["6"] && Array.isArray(userAnswers["6"])) {
    query = query.contains('avoids', userAnswers["6"]);
  }

  const { data: matchedProducts, error } = await query.limit(6);

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  if (!matchedProducts?.length) {
    const { data: fallbackProducts, error: fallbackError } = await supabase
      .from('products')
      .select('*')
      .limit(3);

    if (fallbackError) {
      console.error('Error fetching fallback products:', fallbackError);
      return [];
    }

    return (fallbackProducts || []).map(product => ({
      ...product,
      matchReasons: [],
      matchScore: 0
    }));
  }

  // Calculate match scores and reasons for each product
  const productsWithMatches = matchedProducts.map(product => {
    const matchReasons = calculateMatchScore(product, userAnswers);
    const matchScore = matchReasons.reduce((sum, reason) => sum + reason.score, 0) / matchReasons.length;

    return {
      ...product,
      matchReasons,
      matchScore
    };
  });

  // Sort by match score and return top 3
  return productsWithMatches
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3);
};
