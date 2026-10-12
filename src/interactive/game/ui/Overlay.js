import React, { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useGame, getState, setState, setPersisted } from '../core/store';
import { on } from '../core/events';
import { attachKeyboard, consume, clearInput, input } from '../input/input';
import { initAudio, setMuted, sfx, suspendAudio, disposeAudio } from '../audio/sound';
import { openPanel, closePanel, syncProximityPanel, interactableById } from './actions';
import TitleScreen from './TitleScreen';
import Hud from './Hud';
import Prompt from './Prompt';
import Toasts from './Toasts';
import Panel from './Panel';
import MapScreen from './MapScreen';
import PauseMenu from './PauseMenu';
import TouchControls from './TouchControls';
import ControlsHint from './ControlsHint';

export default function Overlay() {
  const navigate = useNavigate();
  const phase = useGame(s => s.phase);
  const panel = useGame(s => s.panel);
  const mapOpen = useGame(s => s.mapOpen);
  const paused = useGame(s => s.paused);
  const touch = useGame(s => s.touch);
  const fade = useGame(s => s.fade);
  const muted = useGame(s => s.muted);

  const start = useCallback(() => {
    if (getState().phase !== 'title') return;
    initAudio();
    setMuted(getState().muted);
    sfx.start();
    setState({ phase: 'intro' });
  }, []);

  const activate = useCallback(
    it => {
      if (!it) return;
      if (it.panel.type === 'classic') {
        sfx.warp();
        setState({ fade: 1 });
        setTimeout(() => navigate('/classic'), 450);
        return;
      }
      openPanel(it.panel, 'open');
    },
    [navigate]
  );

  const interact = useCallback(() => {
    const s = getState();
    if (s.phase !== 'playing' || s.paused || s.mapOpen || !s.prompt) return;
    activate(s.prompt);
  }, [activate]);

  // clicking / tapping a landmark in the world
  useEffect(
    () =>
      on('clickInteractable', ({ id }) => {
        const s = getState();
        if (s.phase !== 'playing' || s.paused || s.mapOpen) return;
        activate(interactableById(id));
      }),
    [activate]
  );

  // walking up to something opens its sidebar; walking away closes it
  const prompt = useGame(s => s.prompt);
  useEffect(() => syncProximityPanel(prompt), [prompt]);

  // UI-level actions from keyboard / gamepad
  const onAction = useCallback(
    action => {
      const s = getState();
      if (action === 'any') {
        if (s.phase === 'title') start();
        return;
      }
      if (s.phase !== 'playing' && s.phase !== 'intro') return;
      if (action === 'pause') {
        if (s.panel) closePanel();
        else if (s.mapOpen) setState({ mapOpen: false });
        else {
          setState({ paused: !s.paused });
          sfx.click();
        }
      } else if (action === 'map') {
        if (s.paused) return;
        setState({ mapOpen: !s.mapOpen });
        sfx.click();
      } else if (action === 'mute') {
        setPersisted({ muted: !s.muted });
      }
    },
    [start]
  );

  useEffect(() => attachKeyboard(onAction), [onAction]);
  useEffect(() => on('uiAction', onAction), [onAction]);
  useEffect(() => setMuted(muted), [muted]);

  // interact key → poll each animation frame (keyboard & gamepad write `pressed`)
  useEffect(() => {
    let raf;
    const loop = () => {
      if (input.pressed.interact) {
        consume('interact');
        const s = getState();
        // E toggles: put the sidebar away, or read what you're standing at
        if (s.panel) closePanel();
        else interact();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [interact]);

  // gameplay → sound
  useEffect(() => {
    const offs = [
      on('jump', () => sfx.jump()),
      on('doubleJump', () => sfx.doubleJump()),
      on('land', ({ impact }) => sfx.land(impact)),
      on('dash', () => sfx.dash()),
      on('pad', () => sfx.pad()),
      on('collect', ({ combo }) => sfx.collect(combo)),
      on('discover', () => sfx.discover()),
      on('achievement', () => sfx.achievement()),
      on('respawn', () => {
        sfx.respawn();
        setState({ fade: 0.85 });
        setTimeout(() => setState({ fade: 0 }), 260);
      }),
      on('step', ({ alt }) => sfx.step(alt)),
    ];
    return () => offs.forEach(f => f());
  }, []);

  // pause when the tab is hidden; audio follows pause state
  useEffect(() => {
    const vis = () => {
      if (document.hidden && getState().phase === 'playing') setState({ paused: true });
    };
    document.addEventListener('visibilitychange', vis);
    return () => document.removeEventListener('visibilitychange', vis);
  }, []);
  useEffect(() => {
    if (phase === 'playing' || phase === 'intro') suspendAudio(paused);
  }, [paused, phase]);
  useEffect(() => () => disposeAudio(), []);

  // input is live while playing — the sidebar never blocks movement, except
  // the full-screen sheet on phones, which hides the touch controls instead
  useEffect(() => {
    input.enabled = phase === 'playing' && !mapOpen && !paused;
    if (!input.enabled) clearInput();
  }, [phase, mapOpen, paused]);

  const playing = phase === 'playing' || phase === 'intro';

  return (
    <div className="gx-ui">
      {playing && <Hud onAction={onAction} />}
      {phase === 'playing' && <Prompt onInteract={interact} />}
      {phase === 'playing' && touch && !(panel && panel.mode === 'open') && !mapOpen && !paused && <TouchControls onInteract={interact} />}
      {phase === 'playing' && <ControlsHint />}
      <Toasts />
      <AnimatePresence>{panel && <Panel key="panel" panel={panel} />}</AnimatePresence>
      <AnimatePresence>{mapOpen && <MapScreen key="map" />}</AnimatePresence>
      <AnimatePresence>{paused && <PauseMenu key="pause" />}</AnimatePresence>
      <AnimatePresence>{(phase === 'loading' || phase === 'title') && <TitleScreen key="title" onStart={start} />}</AnimatePresence>
      <div className="gx-fade" style={{ opacity: fade }} />
    </div>
  );
}
