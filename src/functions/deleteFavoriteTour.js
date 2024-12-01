export const deleteFavoriteTour = async (userId, tourId) => {
  const response = await fetch(`http://localhost:8080/api/favorite-tours?userId=${userId}&tourId=${tourId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorMessage = await response.text(); 
    throw new Error(`Failed to delete favorite tour: ${errorMessage}`);
  }

  return true; 
};