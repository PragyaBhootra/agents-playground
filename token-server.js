// token-server.js
const express = require('express');
const { AccessToken, VideoGrant } = require('livekit-server-sdk');

const app = express();
const PORT = process.env.PORT || 3001;

const apiKey = process.env.LIVEKIT_API_KEY;
const apiSecret = process.env.LIVEKIT_API_SECRET;

app.use(express.json());

app.get('/token', (req, res) => {
  const { room, identity, agentName } = req.query;

  if (!room || !identity) {
    return res.status(400).json({ error: 'room and identity are required' });
  }

  const at = new AccessToken(apiKey, apiSecret, { identity });
  at.addGrant(new VideoGrant({ roomJoin: true, room }));

  // Optionally add agent dispatch info
  if (agentName) {
    at.setMetadata(JSON.stringify({
      roomConfig: {
        agents: [{ agentName }]
      }
    }));
  }

  const token = at.toJwt();
  res.json({ token });
});

app.listen(PORT, () => {
  console.log(`Token server running on port ${PORT}`);
});

