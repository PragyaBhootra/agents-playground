// token-server.js
import express from 'express';
import { AccessToken, VideoGrant } from 'livekit-server-sdk';

const app = express();
const apiKey = process.env.LIVEKIT_API_KEY;
const apiSecret = process.env.LIVEKIT_API_SECRET;

app.get('/token', (req, res) => {
  const { room, identity, agentName } = req.query;
  const at = new AccessToken(apiKey, apiSecret, { identity });
  at.addGrant(new VideoGrant({ roomJoin: true, room }));

  if (agentName) {
    at.setMetadata(JSON.stringify({
      roomConfig: {
        agents: [{ agentName }]
      }
    }));
  }

  res.send({ token: at.toJwt() });
});

app.listen(3001, () => console.log('Token server running on port 3001'));
