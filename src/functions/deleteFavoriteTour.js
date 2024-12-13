import { FAVORITE_TOUR } from "../config/host";

export const deleteFavoriteTour = async (userId, tourId) => {
  const response = await fetch(
    `${FAVORITE_TOUR}?userId=${userId}&tourId=${tourId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Failed to delete favorite tour: ${errorMessage}`);
  }

  return true;
};
