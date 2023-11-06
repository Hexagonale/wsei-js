"use strict";
const keyToIndex = {
    q: 0,
    w: 1,
    e: 2,
    r: 3,
    t: 4,
    y: 5,
    u: 6,
    i: 7,
    o: 8,
    p: 9,
};
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
class SoundsProvider {
    constructor() {
        this.onKeyDown = this.onKeyDown.bind(this);
    }
    soundElements = [];
    soundListeners = new Set();
    init() {
        const sounds = document.getElementById('sounds');
        if (!sounds) {
            return;
        }
        for (const node of Array.from(sounds.childNodes)) {
            if (!(node instanceof HTMLAudioElement)) {
                continue;
            }
            this.soundElements.push(node);
        }
        for (const soundElement of this.soundElements) {
            soundElement.load();
        }
        window.addEventListener('keydown', this.onKeyDown);
    }
    dispose() {
        window.removeEventListener('keydown', this.onKeyDown);
    }
    addSoundListener(listener) {
        this.soundListeners.add(listener);
    }
    removeSoundListener(listener) {
        this.soundListeners.delete(listener);
    }
    playSound(soundIndex) {
        const sound = this.soundElements[soundIndex];
        if (!sound) {
            return;
        }
        sound.currentTime = 0;
        sound.play();
    }
    onKeyDown = (event) => {
        const key = event.key;
        if (key.length > 1) {
            return;
        }
        const index = keyToIndex[key];
        if (index === undefined) {
            return;
        }
        this.playSound(index);
        for (const listener of this.soundListeners) {
            listener(index);
        }
    };
}
class DrumKit {
    constructor() {
        this.onAddTrack = this.onAddTrack.bind(this);
    }
    tracks = [];
    soundsProvider = new SoundsProvider();
    init() {
        this.soundsProvider.init();
        for (let i = 0; i < 4; i++) {
            const track = new Track(this.soundsProvider, () => this.onRemoveTrack(i));
            track.init();
            this.tracks.push(track);
        }
        const addTrack = document.getElementById('add-track');
        if (!addTrack) {
            return;
        }
        addTrack.addEventListener('click', this.onAddTrack);
    }
    dispose() {
        const addTrack = document.getElementById('add-track');
        addTrack?.removeEventListener('click', this.onAddTrack);
        this.soundsProvider.dispose();
    }
    onAddTrack() {
        const track = new Track(this.soundsProvider, () => this.onRemoveTrack(this.tracks.length));
        track.init();
        this.tracks.push(track);
    }
    onRemoveTrack(index) {
        if (index < 0 || index >= this.tracks.length) {
            return;
        }
        const track = this.tracks[index];
        this.tracks.splice(index, 1);
        track.dispose();
    }
}
var TrackState;
(function (TrackState) {
    TrackState[TrackState["Stopped"] = 0] = "Stopped";
    TrackState[TrackState["Playing"] = 1] = "Playing";
    TrackState[TrackState["Recording"] = 2] = "Recording";
})(TrackState || (TrackState = {}));
class Track {
    soundsProvider;
    onRemove;
    constructor(soundsProvider, onRemove) {
        this.soundsProvider = soundsProvider;
        this.onRemove = onRemove;
        this.onPlay = this.onPlay.bind(this);
        this.onStop = this.onStop.bind(this);
        this.onRecord = this.onRecord.bind(this);
    }
    entriesElement;
    entries = [];
    state = TrackState.Stopped;
    recordingStart = 0;
    init() {
        const tracks = document.getElementById('tracks');
        if (!tracks) {
            return;
        }
        const track = document.createElement('div');
        track.classList.add('track');
        tracks.appendChild(track);
        const controls = document.createElement('div');
        controls.classList.add('controls');
        track.appendChild(controls);
        const play = document.createElement('button');
        play.classList.add('play');
        play.textContent = 'Play';
        play.addEventListener('click', this.onPlay);
        controls.appendChild(play);
        const stop = document.createElement('button');
        stop.classList.add('stop');
        stop.textContent = 'Stop';
        stop.addEventListener('click', this.onStop);
        controls.appendChild(stop);
        const record = document.createElement('button');
        record.classList.add('record');
        record.textContent = 'Record';
        record.addEventListener('click', this.onRecord);
        controls.appendChild(record);
        const remove = document.createElement('button');
        remove.classList.add('remove');
        remove.textContent = 'Remove';
        remove.addEventListener('click', this.onRemove);
        controls.appendChild(remove);
        const entriesWrapper = document.createElement('div');
        entriesWrapper.classList.add('entries-wrapper');
        track.appendChild(entriesWrapper);
        this.entriesElement = document.createElement('div');
        this.entriesElement.classList.add('entries');
        entriesWrapper.appendChild(this.entriesElement);
    }
    dispose() {
        this.onStop();
        const tracks = document.getElementById('tracks');
        if (!tracks) {
            return;
        }
        const track = tracks.querySelector('.track');
        track?.remove();
        this.soundsProvider.removeSoundListener(this.onSound);
    }
    async onPlay() {
        this.state = TrackState.Playing;
        let lastTime = 0;
        for (const entry of this.entries) {
            const delayTime = entry.time - lastTime;
            await delay(delayTime);
            lastTime = entry.time;
            if (this.state !== TrackState.Playing) {
                return;
            }
            this.soundsProvider.playSound(entry.soundIndex);
        }
        this.state = TrackState.Stopped;
    }
    onStop() {
        switch (this.state) {
            case TrackState.Playing:
                break;
            case TrackState.Recording:
                this.soundsProvider.removeSoundListener(this.onSound);
                break;
            case TrackState.Stopped:
                break;
        }
        this.state = TrackState.Stopped;
    }
    onRecord() {
        this.entries = [];
        this.state = TrackState.Recording;
        this.recordingStart = Date.now();
        this.soundsProvider.addSoundListener(this.onSound);
    }
    onSound = (soundIndex) => {
        if (this.state !== TrackState.Recording) {
            return;
        }
        this.entries.push({
            time: Date.now() - this.recordingStart,
            soundIndex,
        });
        this.renderEntries();
    };
    renderEntries() {
        if (!this.entriesElement) {
            return;
        }
        this.entriesElement.innerHTML = '';
        for (const entry of this.entries) {
            const entryElement = document.createElement('div');
            entryElement.classList.add('entry');
            entryElement.style.left = `${entry.time / 10}px`;
            entryElement.style.top = `${entry.soundIndex * 10}px`;
            entryElement.style.backgroundColor = `hsl(${entry.soundIndex * 30}, 100%, 50%)`;
            this.entriesElement.appendChild(entryElement);
        }
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const drumKit = new DrumKit();
    drumKit.init();
});
