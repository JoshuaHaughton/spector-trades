import {
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import api from "src/apis/api";
import { Clock as ClockIcon } from "../../../icons/clock";
import TimeAgo from "timeago-react";

const style = {
  bgcolor: "background.paper",
};

export const CommentCard = ({ comment }) => {
  const [user, setUser] = useState("");


  const fetchUser = async () => {
    try {

      if (comment.user_id === 0) {
        return;
      }

      const response = await api.get(`/users/id/${comment.user_id}`);

      setUser(response.data.data.user);

    } catch (err) {

      console.log(err);
      console.log("Fetch User failed");

    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={style}>
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2} sx={{ justifyContent: "space-between" }}>
            <Grid
              item
              sx={{
                alignItems: "center",
                display: "flex",
              }}
            >
              <Avatar alt="Product" variant="square" />
              <Typography color="textSecondary" display="inline" sx={{ pl: 1 }} variant="body2">
                {user.username}
              </Typography>
            </Grid>
            <Grid
              item
              sx={{
                alignItems: "center",
                display: "flex",
              }}
            >
                {
                comment.created_at
                ?
                <>
                  <ClockIcon color="action" />
                  <Typography color="textSecondary" display="inline" sx={{ pl: 1 }} variant="body2">
                    <TimeAgo datetime={comment.created_at} locale="en" />
                  </Typography>
                </>
                :
                ''
                  }
            </Grid>
          </Grid>
        </Box>
        <Divider />
        <CardContent>{comment.body}</CardContent>
      </Box>
    </Card>
  );
};
