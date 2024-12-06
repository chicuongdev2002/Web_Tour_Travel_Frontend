export const addFavoriteTour = async (userId, tourId) => {
  const response = await fetch(
    `http://localhost:8080/api/favorite-tours?userId=${userId}&tourId=${tourId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to add favorite tour");
  }

  return await response.json();
};
