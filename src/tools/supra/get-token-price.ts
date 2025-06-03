/**
 * Fetches token price from the Supra network
 * @param query Token query to search for (e.g., 'btc', 'eth')
 * @returns Price feed data
 */
export async function getTokenPrice(query: string): Promise<any> {
  try {
    const tradingPair = `${query.toLowerCase()}_usdt`;
    const apiKey = process.env.SUPRA_API_KEY;
    if (!apiKey) {
      throw new Error(
        "Supra API key not set in environment variable SUPRA_API_KEY"
      );
    }
    const response = await fetch(
      `https://prod-kline-rest.supra.com/latest?trading_pair=${tradingPair}`,
      {
        headers: {
          "x-api-key": apiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch price data: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.instruments || data.instruments.length === 0) {
      throw new Error(`No price data found for ${tradingPair}`);
    }

    return data.instruments[0];
  } catch (error: any) {
    throw new Error(`Token price fetch failed: ${error.message}`);
  }
}
