# VidFast Integration Documentation

> Reference documentation for embedding and controlling VidFast video players in web applications.

---

## 1. Overview

VidFast provides embeddable video players for movies and TV shows.

The player is embedded using an `<iframe>` and supports:

- Movie playback
- TV show playback
- AutoPlay
- Start-at-time playback
- Custom player themes
- Server selection
- Subtitle selection
- Fullscreen controls
- Chromecast controls
- Poster display
- Title display
- TV next-episode controls
- TV auto-next playback
- Watch-progress events
- Player status events
- LocalStorage-based progress tracking
- Programmatic player control through the `postMessage` API

---

# 2. Movie Embed

## 2.1 Endpoint

```text
https://vidfast.vc/movie/{id}?autoPlay=true
```

## 2.2 Required Parameters

### `{id}`

Movie identifier.

The identifier can come from:

- IMDb
- TMDB

Example:

```text
https://vidfast.vc/movie/tt6263850
```

```text
https://vidfast.vc/movie/533535
```

---

## 2.3 Optional Parameters

| Parameter          | Description                                                             |
| ------------------ | ----------------------------------------------------------------------- |
| `title`            | Controls whether the media title is displayed.                          |
| `poster`           | Determines if the poster image is shown.                                |
| `autoPlay`         | Controls whether the media starts playing automatically.                |
| `startAt`          | Starts the video at the specified time in seconds.                      |
| `theme`            | Changes the player's color using a hexadecimal color code.              |
| `server`           | Changes the default server for the player. Set this to the server name. |
| `hideServer`       | Controls whether the server selector button is shown or hidden.         |
| `fullscreenButton` | Controls whether the fullscreen button is shown or hidden.              |
| `chromecast`       | Controls whether the Chromecast button is shown or hidden.              |
| `sub`              | Sets the default subtitle, such as `en`, `es`, or `fr`.                 |

---

## 2.4 Movie Embed Examples

### IMDb ID

```text
https://vidfast.vc/movie/tt6263850
```

### TMDB ID

```text
https://vidfast.vc/movie/533535?theme=16A085
```

---

# 3. TV Show Embed

## 3.1 Endpoint

```text
https://vidfast.vc/tv/{id}/{season}/{episode}?autoPlay=true
```

## 3.2 Required Parameters

### `{id}`

TV show identifier.

The identifier can come from:

- IMDb
- TMDB

### `{season}`

The season number.

### `{episode}`

The episode number.

Example:

```text
https://vidfast.vc/tv/tt4052886/1/5
```

---

## 3.3 Optional Parameters

| Parameter          | Description                                                                                |
| ------------------ | ------------------------------------------------------------------------------------------ |
| `title`            | Controls whether the media title is displayed.                                             |
| `poster`           | Determines if the poster image is shown.                                                   |
| `autoPlay`         | Controls whether the media starts playing automatically.                                   |
| `startAt`          | Starts the video at the specified time in seconds.                                         |
| `theme`            | Changes the player's color using a hexadecimal color code.                                 |
| `nextButton`       | Displays the **Next Episode** button when 90% of the current episode has been watched.     |
| `autoNext`         | Automatically plays the next episode when the current episode ends. Requires `nextButton`. |
| `server`           | Changes the default server for the player. Set this to the server name.                    |
| `hideServer`       | Controls whether the server selector button is shown or hidden.                            |
| `fullscreenButton` | Controls whether the fullscreen button is shown or hidden.                                 |
| `chromecast`       | Controls whether the Chromecast button is shown or hidden.                                 |
| `sub`              | Sets the default subtitle, such as `en`, `es`, or `fr`.                                    |

---

## 3.4 TV Embed Examples

### IMDb ID

```text
https://vidfast.vc/tv/tt4052886/1/5
```

### TMDB ID with Next Episode

```text
https://vidfast.vc/tv/63174/1/5?nextButton=true&autoNext=true
```

---

# 4. Basic Implementation

The VidFast player can be embedded using an iframe.

```html
<iframe src="https://vidfast.vc/movie/533535" width="100%" height="100%" frameborder="0" allowfullscreen allow="encrypted-media"></iframe>
```

### Important iframe attributes

| Attribute                 | Purpose                          |
| ------------------------- | -------------------------------- |
| `src`                     | VidFast player URL.              |
| `width`                   | Player width.                    |
| `height`                  | Player height.                   |
| `frameborder="0"`         | Removes the iframe border.       |
| `allowfullscreen`         | Allows fullscreen playback.      |
| `allow="encrypted-media"` | Allows encrypted media playback. |

---

# 5. Responsive Implementation

A responsive player should maintain a **16:9 aspect ratio**.

## 5.1 Standard HTML/CSS Implementation

```html
<div style="position: relative; padding-bottom: 56.25%; height: 0;">
	<iframe src="https://vidfast.vc/movie/533535" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" frameborder="0" allowfullscreen allow="encrypted-media"></iframe>
</div>
```

The `56.25%` padding creates a 16:9 aspect ratio.

---

## 5.2 Responsive Implementation with Tailwind CSS

```html
<div class="relative w-full pt-[56.25%]">
	<iframe src="https://vidfast.vc/movie/533535" class="absolute top-0 left-0 w-full h-full" frameborder="0" allowfullscreen allow="encrypted-media"></iframe>
</div>
```

---

# 6. Color Themes

The player's color can be customized using the `theme` query parameter.

The value should be provided as a hexadecimal color code **without the `#` character**.

---

## 6.1 Green Theme

Hex color:

```text
#16A085
```

Implementation:

```html
<iframe src="https://vidfast.vc/movie/533535?theme=16A085"></iframe>
```

---

## 6.2 Blue Theme

Hex color:

```text
#2980B9
```

Implementation:

```html
<iframe src="https://vidfast.vc/movie/533535?theme=2980B9"></iframe>
```

---

## 6.3 Purple Theme

Hex color:

```text
#9B59B6
```

Implementation:

```html
<iframe src="https://vidfast.vc/movie/533535?theme=9B59B6"></iframe>
```

---

# 7. Advanced Features

## 7.1 Complete Feature Example

The following example demonstrates several TV player features together:

```html
<iframe src="https://vidfast.vc/tv/tt4052886/1/5?autoPlay=true&title=true&poster=true&theme=16A085&nextButton=true&autoNext=true" width="100%" height="100%" frameborder="0" allowfullscreen allow="encrypted-media"></iframe>
```

This example enables:

- AutoPlay
- Title display
- Poster display
- Green theme
- Next Episode button
- Automatic next episode playback

---

# 8. Feature Compatibility Matrix

| Feature        | Movies | TV Shows |
| -------------- | :----: | :------: |
| Color Themes   |   ✓    |    ✓     |
| AutoPlay       |   ✓    |    ✓     |
| Start Time     |   ✓    |    ✓     |
| Poster Display |   ✓    |    ✓     |
| Next Episode   |   ✗    |    ✓     |
| Auto Next      |   ✗    |    ✓     |

### TV-specific behavior

`autoNext` automatically plays the next episode when the current episode ends.

`autoNext` requires:

```text
nextButton=true
```

The Next Episode button appears when **90% of the current episode has been watched**.

---

# 9. Events & Progress Tracking

VidFast players can send watch-progress events to the parent window.

This allows the parent application to track playback progress.

Progress can be stored in:

- Browser `localStorage`
- A custom backend

For a frontend-only implementation, `localStorage` can be used to persist playback progress.

---

# 10. Available Player Events

| Event          | Description                                             |
| -------------- | ------------------------------------------------------- |
| `play`         | Triggered when the video starts playing.                |
| `pause`        | Triggered when the video is paused.                     |
| `seeked`       | Triggered when the user seeks to a different timestamp. |
| `ended`        | Triggered when video playback ends.                     |
| `timeupdate`   | Triggered periodically during video playback.           |
| `playerstatus` | Triggered when `getStatus` is called.                   |

---

# 11. Player Event Data Structure

VidFast sends player events using the following structure:

```js
{
  type: "PLAYER_EVENT",
  data: {
    event: "play" | "pause" | "seeked" | "ended" | "timeupdate" | "playerstatus",
    currentTime: number,
    duration: number,
    tmdbId: number,
    mediaType: "movie" | "tv",
    season?: number,
    episode?: number,
    playing: boolean,
    muted: boolean,
    volume: number
  }
}
```

## 11.1 Data Fields

| Field              | Description                                              |
| ------------------ | -------------------------------------------------------- |
| `type`             | Message type. For player events, this is `PLAYER_EVENT`. |
| `data.event`       | Player event name.                                       |
| `data.currentTime` | Current playback position in seconds.                    |
| `data.duration`    | Total media duration in seconds.                         |
| `data.tmdbId`      | TMDB ID of the media.                                    |
| `data.mediaType`   | Either `movie` or `tv`.                                  |
| `data.season`      | TV season number when applicable.                        |
| `data.episode`     | TV episode number when applicable.                       |
| `data.playing`     | Whether the player is currently playing.                 |
| `data.muted`       | Whether the player is muted.                             |
| `data.volume`      | Current volume level.                                    |

---

# 12. Player Event Listener

The parent window can listen for messages sent by VidFast using the browser `message` event.

## 12.1 Trusted VidFast Origins

The following origins are recognized as VidFast player origins:

```js
const vidfastOrigins = ['https://vidfast.pro', 'https://vidfast.in', 'https://vidfast.io', 'https://vidfast.me', 'https://vidfast.net', 'https://vidfast.pm', 'https://vidfast.vc', 'https://vidfast.bz'];
```

## 12.2 Event Listener Implementation

```js
const vidfastOrigins = ['https://vidfast.pro', 'https://vidfast.in', 'https://vidfast.io', 'https://vidfast.me', 'https://vidfast.net', 'https://vidfast.pm', 'https://vidfast.vc', 'https://vidfast.bz'];

window.addEventListener('message', ({ origin, data }) => {
	if (!vidfastOrigins.includes(origin) || !data) {
		return;
	}

	if (data.type === 'PLAYER_EVENT') {
		const { event, currentTime, duration } = data.data;

		console.log(`Player ${event} at ${currentTime}s of ${duration}s`);

		// Add custom event handling logic here
	}
});
```

### Important

Always verify the message origin before processing messages.

The listener should only process messages from known VidFast origins.

---

# 13. Direct Media Data Event Listener

VidFast also provides a simpler event listener for capturing the complete media data structure.

## 13.1 Supported Origins

This implementation includes:

```js
const vidfastOrigins = ['https://vidfast.pro', 'https://vidfast.in', 'https://vidfast.io', 'https://vidfast.me', 'https://vidfast.net', 'https://vidfast.pm', 'https://vidfast.xyz', 'https://vidfast.vc', 'https://vidfast.bz'];
```

## 13.2 Listener Implementation

```js
const vidfastOrigins = ['https://vidfast.pro', 'https://vidfast.in', 'https://vidfast.io', 'https://vidfast.me', 'https://vidfast.net', 'https://vidfast.pm', 'https://vidfast.xyz', 'https://vidfast.vc', 'https://vidfast.bz'];

window.addEventListener('message', ({ origin, data }) => {
	if (!vidfastOrigins.includes(origin) || !data) {
		return;
	}

	if (data.type === 'MEDIA_DATA') {
		localStorage.setItem('vidFastProgress', JSON.stringify(data.data));
	}
});
```

This stores the complete media data structure in:

```text
localStorage
```

using the key:

```text
vidFastProgress
```

---

# 14. Stored Progress Data Structure

The stored data contains:

- Movie/show details
- Watch progress
- Last watched season
- Last watched episode
- Episode-specific progress for TV shows
- Last updated timestamps

The structure uses media-specific keys.

Movie keys use:

```text
m{tmdbId}
```

TV keys use:

```text
t{tmdbId}
```

---

## 14.1 Complete Example

```json
{
	"t63174": {
		"id": 63174,
		"type": "tv",
		"title": "Lucifer",
		"poster_path": "/ekZobS8isE6mA53RAiGDG93hBxL.jpg",
		"backdrop_path": "/wbiPjTWpZMIB8ffBq7HvzAph4Ft.jpg",
		"progress": {
			"watched": 793.207692,
			"duration": 2695.3689
		},
		"last_season_watched": 1,
		"last_episode_watched": 1,
		"show_progress": {
			"s1e1": {
				"season": 1,
				"episode": 1,
				"progress": {
					"watched": 793.207692,
					"duration": 2695.3689
				},
				"last_updated": 1742578021768
			}
		},
		"last_updated": 1742578021768
	},
	"m533535": {
		"id": 533535,
		"type": "movie",
		"title": "Deadpool & Wolverine",
		"poster_path": "/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
		"backdrop_path": "/by8z9Fe8y7p4jo2YlW2SZDnptyT.jpg",
		"progress": {
			"watched": 353.530349,
			"duration": 7667.227
		},
		"last_updated": 1742577064433
	}
}
```

---

# 15. TV Show Progress Structure

For TV shows, the top-level progress describes the current overall show progress:

```json
{
	"progress": {
		"watched": 793.207692,
		"duration": 2695.3689
	},
	"last_season_watched": 1,
	"last_episode_watched": 1
}
```

Episode-specific progress is stored inside:

```text
show_progress
```

Each episode uses a key following the format:

```text
s{season}e{episode}
```

Example:

```text
s1e1
```

The episode object contains:

```json
{
	"season": 1,
	"episode": 1,
	"progress": {
		"watched": 793.207692,
		"duration": 2695.3689
	},
	"last_updated": 1742578021768
}
```

---

# 16. Movie Progress Structure

Movie progress contains:

```json
{
	"progress": {
		"watched": 353.530349,
		"duration": 7667.227
	},
	"last_updated": 1742577064433
}
```

The movie's metadata is stored alongside its progress.

---

# 17. PostMessage API

VidFast players can be controlled programmatically using the browser `postMessage` API.

This allows the parent application to send commands directly to the embedded VidFast iframe.

The API can be used for integrations such as:

- Custom player controls
- Playback control
- Seeking
- Volume control
- Mute control
- Player status retrieval
- Watch party synchronization

---

# 18. PostMessage API Requirements

The iframe must be available as a DOM element.

Example:

```js
const iframe = document.querySelector('#vidfast-player');
```

Commands are sent to the iframe using:

```js
iframe.contentWindow.postMessage(...)
```

---

# 19. Available PostMessage Commands

## 19.1 Play

Resumes video playback.

```js
iframe.contentWindow.postMessage(
	{
		command: 'play',
	},
	'*',
);
```

---

## 19.2 Pause

Pauses video playback.

```js
iframe.contentWindow.postMessage(
	{
		command: 'pause',
	},
	'*',
);
```

---

## 19.3 Seek

Jumps to a specific playback position.

The `time` value is specified in seconds.

```js
iframe.contentWindow.postMessage(
	{
		command: 'seek',
		time: 120,
	},
	'*',
);
```

The example above jumps to:

```text
2 minutes
```

---

## 19.4 Volume

Sets the player volume.

The `level` value ranges from:

```text
0.0
```

to:

```text
1.0
```

Example:

```js
iframe.contentWindow.postMessage(
	{
		command: 'volume',
		level: 0.5,
	},
	'*',
);
```

This sets the volume to:

```text
50%
```

---

## 19.5 Mute

Controls the player's mute state.

```js
iframe.contentWindow.postMessage(
	{
		command: 'mute',
		muted: true,
	},
	'*',
);
```

Unmute:

```js
iframe.contentWindow.postMessage(
	{
		command: 'mute',
		muted: false,
	},
	'*',
);
```

---

# 20. Get Player Status

The `getStatus` command requests the current player status.

Send:

```js
iframe.contentWindow.postMessage(
	{
		command: 'getStatus',
	},
	'*',
);
```

The response is received through the `message` event.

Example:

```js
window.addEventListener('message', ({ data }) => {
	if (data.type === 'PLAYER_EVENT' && data.data.event === 'playerstatus') {
		console.log('Current time:', data.data.currentTime);
		console.log('Duration:', data.data.duration);
		console.log('Is playing:', data.data.playing);
		console.log('Is muted:', data.data.muted);
		console.log('Volume:', data.data.volume);
	}
});
```

---

# 21. Player Status Response

A `getStatus` request results in a `PLAYER_EVENT` message with:

```text
event: "playerstatus"
```

The response contains:

```js
{
  type: "PLAYER_EVENT",
  data: {
    event: "playerstatus",
    currentTime: number,
    duration: number,
    playing: boolean,
    muted: boolean,
    volume: number
  }
}
```

---

# 22. Watch Party Integration

VidFast's `postMessage` API can be used to synchronize playback between multiple users.

A watch party implementation can synchronize:

- Play
- Pause
- Seek

between participants.

A typical architecture is:

```text
User A
  ↓
VidFast Player
  ↓
Player Event
  ↓
Watch Party Synchronization Layer
  ↓
WebSocket / Socket.IO / Other Communication Layer
  ↓
User B
  ↓
VidFast Player
```

The communication layer is responsible for broadcasting commands between participants.

---

# 23. Watch Party Controller Example

```js
class WatchPartyController {
	vidfastOrigins = ['https://vidfast.pro', 'https://vidfast.in', 'https://vidfast.io', 'https://vidfast.me', 'https://vidfast.net', 'https://vidfast.pm', 'https://vidfast.xyz', 'https://vidfast.vc', 'https://vidfast.bz'];

	constructor(iframeElement) {
		this.iframe = iframeElement;
		this.setupEventListeners();
	}

	// Sync play command to all participants
	syncPlay(time) {
		this.iframe.contentWindow.postMessage(
			{
				command: 'play',
				time: time,
			},
			'*',
		);

		// Broadcast to other participants
		this.broadcastToParty({
			action: 'play',
			time: time,
		});
	}

	// Sync pause command to all participants
	syncPause(time) {
		this.iframe.contentWindow.postMessage(
			{
				command: 'pause',
				time: time,
			},
			'*',
		);

		this.broadcastToParty({
			action: 'pause',
			time: time,
		});
	}

	// Sync seek to specific time for all participants
	syncSeek(time) {
		this.iframe.contentWindow.postMessage(
			{
				command: 'seek',
				time: time,
			},
			'*',
		);

		this.broadcastToParty({
			action: 'seek',
			time: time,
		});
	}

	// Handle incoming party commands
	handlePartyCommand(command) {
		switch (command.action) {
			case 'play':
				this.iframe.contentWindow.postMessage(
					{
						command: 'play',
					},
					'*',
				);
				break;

			case 'pause':
				this.iframe.contentWindow.postMessage(
					{
						command: 'pause',
					},
					'*',
				);
				break;

			case 'seek':
				this.iframe.contentWindow.postMessage(
					{
						command: 'seek',
						time: command.time,
					},
					'*',
				);
				break;
		}
	}

	broadcastToParty(command) {
		// Your party synchronization logic here
		// (WebSocket, Socket.IO, etc.)
	}

	onPlayerStatusUpdate(status) {
		// Your status update logic here
	}

	setupEventListeners() {
		// Listen for player events
		window.addEventListener('message', (event) => {
			if (!this.vidfastOrigins.includes(event.origin) || !event.data) {
				return;
			}

			if (event.data.type === 'PLAYER_EVENT') {
				const { event: playerEvent, currentTime } = event.data.data;

				switch (playerEvent) {
					case 'play':
						this.syncPlay(currentTime);
						break;

					case 'pause':
						this.syncPause(currentTime);
						break;

					case 'seeked':
						this.syncSeek(currentTime);
						break;
				}
			}

			if (event.data.type === 'PLAYER_EVENT' && event.data.data.event === 'playerstatus') {
				this.onPlayerStatusUpdate(event.data.data);
			}
		});
	}
}
```

---

# 24. Watch Party Controller Usage

First obtain the iframe:

```js
const iframe = document.querySelector('#vidfast-player');
```

Then create the controller:

```js
const watchParty = new WatchPartyController(iframe);
```

The controller can then synchronize player actions with other participants.

---

# 25. Watch Party Synchronization Responsibilities

The VidFast player handles playback inside the iframe.

The application is responsible for:

- Connecting participants
- Broadcasting commands
- Receiving commands
- Handling network latency
- Resolving synchronization differences
- Maintaining party state
- Deciding when remote commands should be applied

The communication layer can use technologies such as:

- WebSocket
- Socket.IO
- Another real-time communication mechanism

---

# 26. PostMessage Behavior

According to the provided VidFast documentation:

- PostMessage commands work across all VidFast domains.
- Commands are processed asynchronously.
- Status responses may have a small delay.
- Seek commands accept time in seconds.
- Player status updates should be received through the `message` event.

---

# 27. Security Considerations for Message Events

When receiving messages from an iframe, always validate the message origin before processing it.

Use an explicit allowlist of trusted VidFast origins:

```js
const vidfastOrigins = ['https://vidfast.pro', 'https://vidfast.in', 'https://vidfast.io', 'https://vidfast.me', 'https://vidfast.net', 'https://vidfast.pm', 'https://vidfast.xyz', 'https://vidfast.vc', 'https://vidfast.bz'];
```

Check:

```js
if (!vidfastOrigins.includes(event.origin)) {
	return;
}
```

Also verify that the received message contains data before accessing it:

```js
if (!event.data) {
	return;
}
```

Then check the expected message type:

```js
if (event.data.type === 'PLAYER_EVENT') {
	// Handle player event
}
```

---

# 28. Parameter Reference

## Movie Parameters

| Parameter          | Supported | Description                                   |
| ------------------ | :-------: | --------------------------------------------- |
| `id`               | Required  | IMDb or TMDB movie identifier.                |
| `title`            | Optional  | Show/hide media title.                        |
| `poster`           | Optional  | Show/hide poster image.                       |
| `autoPlay`         | Optional  | Automatically start playback.                 |
| `startAt`          | Optional  | Start playback at a specific time in seconds. |
| `theme`            | Optional  | Player theme color in hexadecimal format.     |
| `server`           | Optional  | Select the default server by server name.     |
| `hideServer`       | Optional  | Show/hide server selector.                    |
| `fullscreenButton` | Optional  | Show/hide fullscreen button.                  |
| `chromecast`       | Optional  | Show/hide Chromecast button.                  |
| `sub`              | Optional  | Set default subtitle language.                |

## TV Parameters

| Parameter          | Supported | Description                                                 |
| ------------------ | :-------: | ----------------------------------------------------------- |
| `id`               | Required  | IMDb or TMDB TV show identifier.                            |
| `season`           | Required  | Season number.                                              |
| `episode`          | Required  | Episode number.                                             |
| `title`            | Optional  | Show/hide media title.                                      |
| `poster`           | Optional  | Show/hide poster image.                                     |
| `autoPlay`         | Optional  | Automatically start playback.                               |
| `startAt`          | Optional  | Start playback at a specific time in seconds.               |
| `theme`            | Optional  | Player theme color in hexadecimal format.                   |
| `nextButton`       | Optional  | Show Next Episode button after 90% watched.                 |
| `autoNext`         | Optional  | Automatically play the next episode. Requires `nextButton`. |
| `server`           | Optional  | Select the default server by server name.                   |
| `hideServer`       | Optional  | Show/hide server selector.                                  |
| `fullscreenButton` | Optional  | Show/hide fullscreen button.                                |
| `chromecast`       | Optional  | Show/hide Chromecast button.                                |
| `sub`              | Optional  | Set default subtitle language.                              |

---

# 29. Event Reference

| Message Type   | Event          | Description                                |
| -------------- | -------------- | ------------------------------------------ |
| `PLAYER_EVENT` | `play`         | Playback started.                          |
| `PLAYER_EVENT` | `pause`        | Playback paused.                           |
| `PLAYER_EVENT` | `seeked`       | Playback position changed through seeking. |
| `PLAYER_EVENT` | `ended`        | Playback ended.                            |
| `PLAYER_EVENT` | `timeupdate`   | Periodic playback progress update.         |
| `PLAYER_EVENT` | `playerstatus` | Response generated by `getStatus`.         |
| `MEDIA_DATA`   | —              | Complete media/progress data structure.    |

---

# 30. Integration Examples

## 30.1 Basic Movie

```html
<iframe src="https://vidfast.vc/movie/533535" width="100%" height="100%" frameborder="0" allowfullscreen allow="encrypted-media"></iframe>
```

## 30.2 Movie with AutoPlay

```html
<iframe src="https://vidfast.vc/movie/533535?autoPlay=true" width="100%" height="100%" frameborder="0" allowfullscreen allow="encrypted-media"></iframe>
```

## 30.3 Movie with Theme

```html
<iframe src="https://vidfast.vc/movie/533535?theme=16A085" width="100%" height="100%" frameborder="0" allowfullscreen allow="encrypted-media"></iframe>
```

## 30.4 TV Episode

```html
<iframe src="https://vidfast.vc/tv/63174/1/5" width="100%" height="100%" frameborder="0" allowfullscreen allow="encrypted-media"></iframe>
```

## 30.5 TV with Auto Next

```html
<iframe src="https://vidfast.vc/tv/63174/1/5?nextButton=true&autoNext=true" width="100%" height="100%" frameborder="0" allowfullscreen allow="encrypted-media"></iframe>
```

## 30.6 TV with Multiple Features

```html
<iframe src="https://vidfast.vc/tv/tt4052886/1/5?autoPlay=true&title=true&poster=true&theme=16A085&nextButton=true&autoNext=true" width="100%" height="100%" frameborder="0" allowfullscreen allow="encrypted-media"></iframe>
```

---

# 31. Responsive Player Pattern

The recommended 16:9 responsive structure is:

```html
<div class="relative w-full pt-[56.25%]">
	<iframe src="https://vidfast.vc/movie/533535" class="absolute inset-0 h-full w-full" frameborder="0" allowfullscreen allow="encrypted-media"></iframe>
</div>
```

The iframe fills the aspect-ratio container while maintaining a 16:9 player.

---

# 32. Progress Tracking Flow

A typical progress-tracking flow is:

```text
VidFast Player
      ↓
PLAYER_EVENT / MEDIA_DATA
      ↓
Parent Window
      ↓
Validate VidFast Origin
      ↓
Read Playback Data
      ↓
Update Application State
      ↓
Persist to localStorage
```

For TV shows:

```text
TV Player
   ↓
Show ID
   ↓
Season
   ↓
Episode
   ↓
Current Time / Duration
   ↓
Episode Progress
   ↓
show_progress
```

---

# 33. Programmatic Control Flow

A typical player-control flow is:

```text
Application UI
      ↓
postMessage()
      ↓
VidFast iframe
      ↓
Player Command
      ↓
Playback State Changes
      ↓
PLAYER_EVENT
      ↓
Parent Window
```

For example:

```text
Custom Play Button
      ↓
command: "play"
      ↓
VidFast Player
      ↓
Playback Starts
      ↓
PLAYER_EVENT: "play"
```

---

# 34. Important Notes

- VidFast movie IDs can be IMDb or TMDB identifiers.
- VidFast TV IDs can be IMDb or TMDB identifiers.
- TV playback requires both a season and episode number.
- `autoNext` requires `nextButton`.
- The Next Episode button appears when 90% of the current episode has been watched.
- `startAt` uses seconds.
- Volume levels use a `0.0`–`1.0` range.
- `getStatus` responds asynchronously.
- PostMessage commands are processed asynchronously.
- Player events are delivered through the browser `message` event.
- Progress can be saved to `localStorage` or a backend.
- The `MEDIA_DATA` event can be used to store the complete media progress structure.
- Message origins should always be validated before processing messages.
- VidFast player commands use the iframe's `contentWindow.postMessage()` API.
- PostMessage commands work across the listed VidFast domains.
- Seek commands accept time in seconds.
- Watch-party implementations must account for network latency and synchronization differences.

---

# 35. Quick Reference

## Movie

```text
https://vidfast.vc/movie/{id}
```

## TV

```text
https://vidfast.vc/tv/{id}/{season}/{episode}
```

## Movie with AutoPlay

```text
https://vidfast.vc/movie/{id}?autoPlay=true
```

## TV with AutoPlay

```text
https://vidfast.vc/tv/{id}/{season}/{episode}?autoPlay=true
```

## TV with Auto Next

```text
https://vidfast.vc/tv/{id}/{season}/{episode}?nextButton=true&autoNext=true
```

## Theme

```text
?theme=HEXCODE
```

Example:

```text
?theme=16A085
```

## Start Position

```text
?startAt=120
```

## Subtitle

```text
?sub=en
```

## Player Commands

```text
play
pause
seek
volume
mute
getStatus
```

## Player Events

```text
play
pause
seeked
ended
timeupdate
playerstatus
```

## Message Types

```text
PLAYER_EVENT
MEDIA_DATA
```

## Progress Storage Key

```text
vidFastProgress
```

---

# 36. Source

VidFast integration information documented in this file is based on the VidFast integration details provided for this project.

Primary VidFast domain:

```text
https://vidfast.vc/
```
