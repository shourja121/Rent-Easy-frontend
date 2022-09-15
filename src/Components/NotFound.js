import React from 'react';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
const NotFound = () => {
  return (
    <div style={{ color: "gray" }} className="mx-auto not-found">
        Page does not exist!!<SentimentDissatisfiedIcon/>
    </div>
  )
}

export default NotFound;
