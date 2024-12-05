import React from "react";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from "@mui/lab";
import { Typography, Box, useTheme, styled } from "@mui/material";
import { Users, Calendar } from "lucide-react";

const CustomTimelineDot = styled(TimelineDot)(({ theme, isPast }) => ({
  padding: theme.spacing(1),
  margin: theme.spacing(0),
  backgroundColor: isPast
    ? theme.palette.grey[400]
    : theme.palette.primary.main,
}));

const InfoBox = styled(Box)(({ theme, isPast }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  "& svg": {
    color: isPast ? theme.palette.grey[400] : theme.palette.primary.main,
    width: 16,
    height: 16,
  },
}));

const TourContent = styled(Box)(({ theme, isPast }) => ({
  padding: theme.spacing(2),
  backgroundColor: isPast
    ? theme.palette.grey[100]
    : theme.palette.primary.light,
  borderRadius: theme.shape.borderRadius,
  "& .MuiTypography-root": {
    textDecoration: isPast ? "line-through" : "none",
    color: isPast ? theme.palette.grey[600] : "inherit",
  },
}));

const TourTimeline = ({ tours }) => {
  const theme = useTheme();
  const currentDate = new Date();

  // Sort tours by start date
  const sortedTours = [...(tours || [])].sort(
    (a, b) => new Date(a.startDate) - new Date(b.startDate),
  );

  if (!tours?.length) {
    return (
      <Typography variant="body1" align="center" sx={{ py: 4 }}>
        Không có tour nào để hiển thị
      </Typography>
    );
  }

  return (
    <Timeline position="right">
      {sortedTours.map((tour, index) => {
        const startDate = new Date(tour.startDate);
        const endDate = new Date(tour.endDate);
        const isPastTour = endDate < currentDate;

        return (
          <TimelineItem key={index}>
            <TimelineOppositeContent sx={{ flex: 0.3 }}>
              <InfoBox isPast={isPastTour}>
                <Calendar />
                <Typography variant="body2">
                  {startDate.toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                  {" - "}
                  {endDate.toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </Typography>
              </InfoBox>
            </TimelineOppositeContent>

            <TimelineSeparator>
              <CustomTimelineDot isPast={isPastTour} />
              {index < tours.length - 1 && (
                <TimelineConnector
                  sx={{
                    backgroundColor: isPastTour
                      ? theme.palette.grey[300]
                      : theme.palette.primary.light,
                  }}
                />
              )}
            </TimelineSeparator>

            <TimelineContent>
              <TourContent isPast={isPastTour}>
                <Typography variant="h6" component="h3" gutterBottom>
                  {tour.tourName}
                </Typography>
                <InfoBox isPast={isPastTour}>
                  <Users />
                  <Typography variant="body2">
                    {tour.customers.length}/{tour.maxParticipants} khách
                  </Typography>
                </InfoBox>
              </TourContent>
            </TimelineContent>
          </TimelineItem>
        );
      })}
    </Timeline>
  );
};

export default TourTimeline;
