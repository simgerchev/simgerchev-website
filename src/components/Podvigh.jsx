import React, { useState, useEffect, useRef } from "react";
import "../App.css";
import zoneObjects from '../data/podvigh/zoneObjects.json';
import randomEvents from '../data/podvigh/randomEvents.json';
import forestInteractions from '../data/podvigh/interactions/forest.json';
import ruinsInteractions from '../data/podvigh/interactions/ruins.json';
import desertInteractions from '../data/podvigh/interactions/desert.json';

// --- CONFIG ---
const MAP_WIDTH = 50;
const MAP_HEIGHT = 25;
const ZONES = zoneObjects;
const ZONE_DURATION_MS = 20000; // how long a zone stays before being replaced (20s)
// (no additional visual features)
const SANCTUARY_REQUIREMENTS = { faith: 14 };
const SANCTUARY_RADIUS = 3;
// Encounter probability configuration (reduced further to avoid constant encounters)
const SPECIAL_CHANCE = 0.01; // ~1% per tile chance to be a special
const NPC_CHANCE = 0.01; // ~1% per tile chance to be an npc
const EVENT_CHANCE = 0.03; // 3% chance for random event on move
const REFLECTION_CHANCE = 0.09; // 9% chance for reflection message

// --- UTILS ---
function randomZone() {
    return ZONES[Math.floor(Math.random() * ZONES.length)];
}
function randomReflection(zone) {
    return zone.reflections[Math.floor(Math.random() * zone.reflections.length)];
}
function randomSpecial(zoneName) {
    const objects = INTERACTION_OBJECTS_BY_ZONE[zoneName] || [];
    const allowed = objects.filter(obj => obj.type === "special");
    if (allowed.length === 0) return null;
    return allowed[Math.floor(Math.random() * allowed.length)];
}
function randomNPC(zoneName) {
    const objects = INTERACTION_OBJECTS_BY_ZONE[zoneName] || [];
    const allowed = objects.filter(obj => obj.type === "npc");
    if (allowed.length === 0) return null;
    return allowed[Math.floor(Math.random() * allowed.length)];
}


function generateZoneFeatures(zone) {
    // Generate additional features for a zone (none currently).
    // We'll create a deterministic PRNG per zone using a simple LCG so the same
    // zone name yields the same features until the zone is replaced.
    function lcg(seed) {
        let s = seed >>> 0;
        return function() {
            s = (1664525 * s + 1013904223) >>> 0;
            return s / 0x100000000;
        };
    }

    // derive seed from zone.name (fall back to random if unavailable)
    const name = zone.name || JSON.stringify(zone);
    let seed = 0;
    for (let i = 0; i < name.length; i++) seed = (seed * 31 + name.charCodeAt(i)) >>> 0;

    const width = MAP_WIDTH;
    const height = MAP_HEIGHT;

    // No additional features for now
    return { ...zone };
}

// --- COMPONENT ---
const podvigh = () => {
    // World state
    // start player centered in the zone
    const [player, setPlayer] = useState({ x: Math.floor(MAP_WIDTH/2), y: Math.floor(MAP_HEIGHT/2) });
    const [zones, setZones] = useState([
        { zone: generateZoneFeatures(randomZone()), origin: { x: 0, y: 0 } },
    ]);
    const [messages, setMessages] = useState([
        "You begin your walk in silence.",
    ]);
    const steps = useRef(0);
    // visited tiles trail: keys are "x,y" -> true
    const [visited, setVisited] = useState({
        [`${Math.floor(MAP_WIDTH/2)},${Math.floor(MAP_HEIGHT/2)}`]: true
    });

    // Game state
    const [state, setState] = useState({
        faith: 5,
        health: 8,
    });
    const [gameOver, setGameOver] = useState(false);
    const [ending, setEnding] = useState("");
    const [usedSpecials, setUsedSpecials] = useState([]);
    const [pendingAction, setPendingAction] = useState(null);
    const [pendingChoice, setPendingChoice] = useState(null); // { choices, actionData, x, y }

    // Sanctuary
    const [sanctuarySpawned, setSanctuarySpawned] = useState(false);
    const [sanctuaryPos, setSanctuaryPos] = useState(null);

    useEffect(() => {
        if (
            !sanctuarySpawned &&
            state.faith >= SANCTUARY_REQUIREMENTS.faith
        ) {
            const px = player.x;
            const py = player.y;
            const offsetX = Math.floor(Math.random() * (SANCTUARY_RADIUS * 2 + 1)) - SANCTUARY_RADIUS;
            const offsetY = Math.floor(Math.random() * (SANCTUARY_RADIUS * 2 + 1)) - SANCTUARY_RADIUS;
            setSanctuaryPos({ x: px + offsetX, y: py + offsetY });
            setSanctuarySpawned(true);
            setMessages(msgs => [
                ...msgs.slice(-4),
                "A hidden passage opens nearby. The Sanctuary is revealed!"
            ]);
        }
    }, [state.faith, sanctuarySpawned, player.x, player.y]);

    function getZoneAt(x, y) {
        for (let i = zones.length - 1; i >= 0; i--) {
            const { zone, origin } = zones[i];
            if (
                x >= origin.x &&
                x < origin.x + MAP_WIDTH &&
                y >= origin.y &&
                y < origin.y + MAP_HEIGHT
            ) {
                return { zone, origin };
            }
        }
        return { zone: zones[0].zone, origin: zones[0].origin };
    }

    // Deterministic helpers for mapping coordinates to stable pseudo-random values
    function deterministicFraction(x, y, zoneName) {
        const s = Math.abs(x * 73856093 ^ y * 19349663 ^ (zoneName ? zoneName.length : 42));
        let v = s >>> 0;
        v = (1664525 * v + 1013904223) >>> 0;
        return v / 0x100000000;
    }

    function deterministicIndex(listLength, x, y, zoneName) {
        const h = Math.abs(x * 73856093 ^ y * 19349663 ^ (zoneName ? zoneName.length : 42));
        return h % listLength;
    }

    function getAreaCoordsForPlace(ox, oy, size) {
        const coords = [];
        const w = (size && size.w) || 1;
        const h = (size && size.h) || 1;
        for (let yy = oy; yy < oy + h; yy++) {
            for (let xx = ox; xx < ox + w; xx++) {
                coords.push(`${xx},${yy}`);
            }
        }
        return coords;
    }

    // Check whether a given tile belongs to a deterministically-placed 'place' object.
    // If it does, return { place, originX, originY } else null.
    function findPlaceAtTile(x, y) {
        const { zone, origin } = getZoneAt(x, y);
        const objects = INTERACTION_OBJECTS_BY_ZONE[zone.name] || [];
        const placeCandidates = objects.filter(o => o.type === 'place' && (!o.allowedZones || o.allowedZones.includes(zone.name)));
        if (placeCandidates.length === 0) return null;

        // allowedSpecials includes both single-tile specials and place type so deterministic index matches selection logic
        const allowedSpecials = objects.filter(o => (o.type === 'special' || o.type === 'place'));
        if (allowedSpecials.length === 0) return null;

        for (const place of placeCandidates) {
            const w = (place.size && place.size.w) || 1;
            const h = (place.size && place.size.h) || 1;
            // origin candidate ranges so that (x,y) falls inside ox..ox+w-1, oy..oy+h-1
            for (let ox = x - (w - 1); ox <= x; ox++) {
                for (let oy = y - (h - 1); oy <= y; oy++) {
                    // ensure origin sits within the zone bounds
                    if (ox < origin.x || oy < origin.y) continue;
                    if (ox + w > origin.x + MAP_WIDTH || oy + h > origin.y + MAP_HEIGHT) continue;
                    const frac = deterministicFraction(ox, oy, zone.name);
                    if (frac < SPECIAL_CHANCE) {
                        // deterministic selection among allowed specials/places
                        const idx = deterministicIndex(allowedSpecials.length, ox, oy, zone.name);
                        const selected = allowedSpecials[idx];
                        if (selected && selected.name === place.name && selected.type === 'place') {
                            return { place: selected, originX: ox, originY: oy };
                        }
                    }
                }
            }
        }
        return null;
    }

    function getTile(x, y) {
        const { zone, origin } = getZoneAt(x, y);

        // fall through to special/some tile selection

        if (
            sanctuarySpawned &&
            sanctuaryPos &&
            x === sanctuaryPos.x &&
            y === sanctuaryPos.y
        ) {
            return {
                char: "C",
                color: "#FF4500",
                zone,
                special: {
                    char: "C",
                    name: "Sanctuary",
                    color: "#FF4500",
                    effect: (state, setState, setMessages, setEnding, setGameOver) => {
                        setEnding("You enter the Sanctuary. You have found peace.");
                        setMessages(msgs => [
                            ...msgs.slice(-4),
                            "You kneel in the Sanctuary. You have found peace.",
                            "Press R to restart."
                        ]);
                        setGameOver(true);
                    },
                    description: "A place of peace and rest."
                }
            };
        }
        const specialKey = `${x},${y}`;
        if (usedSpecials.includes(specialKey)) {
            const idx = Math.abs(x * 73856093 ^ y * 19349663 ^ zone.name.length) % zone.tiles.length;
            return { char: zone.tiles[idx], color: zone.color, zone };
        }

        // Multi-tile 'place' handling: check if this tile belongs to a placed 'place' object
        const placeInfo = findPlaceAtTile(x, y);
        if (placeInfo) {
            const { place, originX, originY } = placeInfo;
            // if this tile was consumed, show base tile instead
            if (usedSpecials.includes(`${x},${y}`)) {
                const idx = Math.abs(x * 73856093 ^ y * 19349663 ^ zone.name.length) % zone.tiles.length;
                return { char: zone.tiles[idx], color: zone.color, zone };
            }
            return {
                char: place.char || '~',
                color: place.color || zone.color,
                zone,
                special: place,
                placeOriginX: originX,
                placeOriginY: originY,
                placeSize: place.size || { w: 1, h: 1 },
                description: place.description,
            };
        }
        // Deterministic per-tile random based on coordinates to keep features stable
        const tileRand = (() => {
            const s = Math.abs(x * 73856093 ^ y * 19349663 ^ (zone.name ? zone.name.length : 42));
            let v = s >>> 0;
            // simple LCG step to get a fraction
            v = (1664525 * v + 1013904223) >>> 0;
            return v / 0x100000000;
        })();
        if (tileRand < SPECIAL_CHANCE) {
            const special = randomSpecial(zone.name);
            if (special) {
                return { char: special.char, color: special.color, zone, special, description: special.description, x, y };
            }
        }
        if (tileRand >= SPECIAL_CHANCE && tileRand < SPECIAL_CHANCE + NPC_CHANCE && !usedSpecials.includes(`${x},${y}`)) {
            const npc = randomNPC(zone.name);
            if (npc) {
                return { char: npc.char, color: npc.color, zone, npc, description: npc.description, x, y };
            }
        }
        const idx = Math.abs(x * 73856093 ^ y * 19349663 ^ zone.name.length) % zone.tiles.length;
        return { char: zone.tiles[idx], color: zone.color, zone };
    }

    // Instead of generating and keeping many zones, keep only a single active zone
    // and rotate it periodically to a new randomly generated zone.
    useEffect(() => {
        const timer = setInterval(() => {
                const zobj = randomZone();
                const newZone = { zone: generateZoneFeatures(zobj), origin: { x: 0, y: 0 } };
                setZones([newZone]);
            // recenter the player into the middle of the new zone so features like rivers are visible
            setPlayer({ x: Math.floor(MAP_WIDTH/2), y: Math.floor(MAP_HEIGHT/2) });
            // clear visited tiles and used specials so the new zone is fresh
            const centerKey = `${Math.floor(MAP_WIDTH/2)},${Math.floor(MAP_HEIGHT/2)}`;
            setVisited({ [centerKey]: true });
            setUsedSpecials([]);
                setMessages(msgs => [...msgs.slice(-4), `A new zone appears: ${newZone.zone.name}`]);
            // reset sanctuary spawn for the new zone
            setSanctuarySpawned(false);
            setSanctuaryPos(null);
        }, ZONE_DURATION_MS);
        return () => clearInterval(timer);
    }, []);

    // (no dynamic feature regeneration)

    useEffect(() => {
        function handleKey(e) {
            if (gameOver && (e.key === "r" || e.key === "R")) {
                restartGame();
                return;
            }
            if (gameOver) return;

            // --- CHOICE HANDLING: must be first! ---
            if (pendingChoice) {
                if (e.key >= "1" && e.key <= String(pendingChoice.choices.length)) {
                    const idx = Number(e.key) - 1;
                    const choice = pendingChoice.choices[idx];
                    if (choice.effect) {
                        applyEffect(choice.effect, state, setState, setMessages);
                    }
                    if (choice.message) {
                        setMessages(msgs => [...msgs.slice(-4), choice.message]);
                    }
                    if (pendingChoice.actionData.type === "special") {
                        setUsedSpecials(prev => [...prev, `${pendingChoice.x},${pendingChoice.y}`]);
                    }
                    setPendingChoice(null);
                }
                // Block all other input while a choice is pending
                return;
            }

            // --- rest of your handleKey logic (pendingAction, movement, etc) ---
            if (pendingAction) {
                // Only process if correct key is pressed
                if (
                    (pendingAction.type === "special" && (e.key === "g" || e.key === "G")) ||
                    (pendingAction.type === "npc" && (e.key === "g" || e.key === "G"))
                ) {
                    if (pendingAction.data.choices && pendingAction.data.choices.length > 0) {
                        const choicesMsg = [
                            "What do you do?",
                            ...pendingAction.data.choices.map((choice, idx) => `${idx + 1}. ${choice.label}`),
                            "(Press 1, 2, 3... to choose)"
                        ].join('\n');
                        setMessages(msgs => [...msgs.slice(-4), choicesMsg]);
                        setPendingChoice({
                            choices: pendingAction.data.choices,
                            actionData: pendingAction.data,
                            x: pendingAction.x,
                            y: pendingAction.y
                        });
                        setPendingAction(null);
                        return;
                    }
                    if (pendingAction.type === "special") {
                        if (pendingAction.data.name === "Sanctuary") {
                            setEnding("You enter the Sanctuary. You have found peace.");
                            setMessages(msgs => [
                                ...msgs.slice(-4),
                                "You kneel in the Sanctuary. You have found peace.",
                                "Press R to restart."
                            ]);
                            setGameOver(true);
                        } else {
                            applyEffect(pendingAction.data.effect, state, setState, setMessages);
                            if (pendingAction.data.message) {
                                setMessages(msgs => [
                                    ...msgs.slice(-4),
                                    pendingAction.data.message
                                ]);
                            }
                            // If this special is part of a multi-tile place, mark the entire area used
                            if (pendingAction.placeOriginX !== undefined && pendingAction.placeOriginY !== undefined && pendingAction.placeSize) {
                                const area = getAreaCoordsForPlace(pendingAction.placeOriginX, pendingAction.placeOriginY, pendingAction.placeSize);
                                setUsedSpecials(prev => Array.from(new Set([...prev, ...area])));
                            } else {
                                setUsedSpecials(prev => [...prev, `${pendingAction.x},${pendingAction.y}`]);
                            }
                        }
                    } else if (pendingAction.type === "npc") {
                        const line = pendingAction.data.dialogue[Math.floor(Math.random() * pendingAction.data.dialogue.length)];
                        setMessages(msgs => [
                            ...msgs.slice(-4),
                            `${pendingAction.data.name}: "${line}"`,
                        ]);
                        if (typeof pendingAction.data.effect === 'function') {
                            pendingAction.data.effect(state, setState, setMessages);
                        } else {
                            applyEffect(pendingAction.data.effect, state, setState, setMessages);
                        }
                        if (pendingAction.placeOriginX !== undefined && pendingAction.placeOriginY !== undefined && pendingAction.placeSize) {
                            const area = getAreaCoordsForPlace(pendingAction.placeOriginX, pendingAction.placeOriginY, pendingAction.placeSize);
                            setUsedSpecials(prev => Array.from(new Set([...prev, ...area])));
                        } else {
                            setUsedSpecials(prev => [...prev, `${pendingAction.x},${pendingAction.y}`]);
                        }
                    }
                    setPendingAction(null);
                    return;
                } else if (
                    (pendingAction.type === "special" && (e.key === "e" || e.key === "E")) ||
                    (pendingAction.type === "npc" && (e.key === "e" || e.key === "E"))
                ) {
                    // Pressing E cancels the pending interaction; after that movement is allowed
                    setPendingAction(null);
                    setMessages(msgs => [...msgs.slice(-4), "You step away."]);
                    return;
                } else {
                    // Block all other input (including movement) until user presses G to interact or E to cancel
                    return;
                }
            }

            let dx = 0, dy = 0;
            if (e.key === "ArrowUp" || e.key === "w") dy = -1;
            if (e.key === "ArrowDown" || e.key === "s") dy = 1;
            if (e.key === "ArrowLeft" || e.key === "a") dx = -1;
            if (e.key === "ArrowRight" || e.key === "d") dx = 1;
            if (dx !== 0 || dy !== 0) {
                const newX = player.x + dx;
                const newY = player.y + dy;
                // record the tile we're stepping off of so it becomes 'visited'
                const prevKey = `${player.x},${player.y}`;
                setVisited(prev => ({ ...prev, [prevKey]: true }));
                setPlayer({ x: newX, y: newY });
                steps.current += 1;
                // (river regeneration removed)
                const tile = getTile(newX, newY);
                if (tile.special) {
                    setMessages(msgs => [
                        ...msgs.slice(-4),
                        `You see a ${tile.special.name.toLowerCase()}.\n${tile.special.description || ""}\nPress G to interact, E to ignore.`
                    ]);
                    setPendingAction({
                        type: "special",
                        data: tile.special,
                        x: newX,
                        y: newY
                    });
                    return; // Stop here, wait for user to press 'g'
                } else if (tile.npc) {
                    setMessages(msgs => [
                        ...msgs.slice(-4),
                        `You meet ${tile.npc.name}.\n${tile.npc.description || ""}\nPress G to interact, E to ignore.`
                    ]);
                    setPendingAction({
                        type: "npc",
                        data: tile.npc,
                        x: newX,
                        y: newY
                    });
                    return; // Stop here, wait for user to press 't'
                } else {
                    setPendingAction(null);
                    // --- RANDOM EVENT ---
                    const { zone } = getZoneAt(newX, newY);
                    const zoneEvents = randomEvents.filter(ev =>
                        !ev.allowedZones || ev.allowedZones.includes(zone.name)
                    );
                    if (zoneEvents.length > 0 && Math.random() < EVENT_CHANCE) {
                        const event = zoneEvents[Math.floor(Math.random() * zoneEvents.length)];
                        setMessages(msgs => [...msgs.slice(-4), event.msg]);
                        applyEffect(event.effect, state, setState, setMessages);
                    }
                }
                // Occasionally show reflection
                if (Math.random() < REFLECTION_CHANCE) {
                    const { zone } = getZoneAt(newX, newY);
                    setMessages((msgs) => [
                        ...msgs.slice(-4),
                        randomReflection(zone),
                    ]);
                }
                // Lose if health drops to zero
                if (state.health <= 1) {
                    setEnding("You have perished in the labyrinth. Game over.");
                    setMessages(msgs => [
                        ...msgs.slice(-4),
                        "You have perished in the labyrinth. Game over.",
                        "Press R to restart."
                    ]);
                    setGameOver(true);
                }
            }
         }
         window.addEventListener("keydown", handleKey);
         return () => window.removeEventListener("keydown", handleKey);
     }, [player, zones, state, gameOver, pendingAction, pendingChoice]);

    // Render map
    const mapRows = [];
    // Compute visible bounds
    const minY = player.y - Math.floor(MAP_HEIGHT / 2);
    const maxY = player.y + Math.floor(MAP_HEIGHT / 2);
    const minX = player.x - Math.floor(MAP_WIDTH / 2);
    const maxX = player.x + Math.floor(MAP_WIDTH / 2);

    for (let y = minY; y <= maxY; y++) {
        let row = [];
        for (let x = minX; x <= maxX; x++) {
            // border if on outermost row/column
            const isBorder = (y === minY || y === maxY || x === minX || x === maxX);
            if (isBorder) {
                row.push(
                    <span key={x} style={{ color: '#F20505', fontWeight: 'bold' }}>
                        #
                    </span>
                );
                continue;
            }

            if (x === player.x && y === player.y) {
                row.push(
                    <span key={x} style={{ color: "#fff", fontWeight: "bold" }}>
                        @
                    </span>
                );
            } else {
                const tile = getTile(x, y);
                const key = `${x},${y}`;
                const isVisited = !!visited[key];
                row.push(
                    <span
                        key={x}
                        style={{ color: isVisited ? '#000000' : tile.color }}
                    >
                        {tile.char}
                    </span>
                );
            }
        }
        mapRows.push(
            <div key={y} style={{ fontFamily: "Fira Mono, monospace", lineHeight: "1.1em" }}>
                {row}
            </div>
        );
    }

    // Restart game
    const restartGame = () => {
        setPlayer({ x: Math.floor(MAP_WIDTH/2), y: Math.floor(MAP_HEIGHT/2) });
        setZones([{ zone: generateZoneFeatures(randomZone()), origin: { x: 0, y: 0 } }]);
        setMessages(["You begin your walk in silence."]);
        setState({
            faith: 5,
            health: 8,
        });
        // reset visited trail
        setVisited({ [`${Math.floor(MAP_WIDTH/2)},${Math.floor(MAP_HEIGHT/2)}`]: true });
        setGameOver(false);
        setEnding("");
        steps.current = 0;
        setSanctuarySpawned(false);
        setSanctuaryPos(null);
        setUsedSpecials([]);
    };

    function applyEffect(effect, state, setState, setMessages) {
        if (!effect) return;
        if (effect.startsWith("faith+")) {
            const val = parseInt(effect.split("+")[1], 10);
            setState(s => ({ ...s, faith: s.faith + val }));
            setMessages(msgs => [...msgs.slice(-4), `Faith +${val}.`]);
        } else if (effect.startsWith("faith-")) {
            const val = parseInt(effect.split("-")[1], 10);
            setState(s => ({ ...s, faith: Math.max(0, s.faith - val) }));
            setMessages(msgs => [...msgs.slice(-4), `Faith -${val}.`]);
        } else if (effect.startsWith("health+")) {
            const val = parseInt(effect.split("+")[1], 10);
            setState(s => ({ ...s, health: Math.min(10, s.health + val) }));
            setMessages(msgs => [...msgs.slice(-4), `Health +${val}.`]);
        } else if (effect.startsWith("health-")) {
            const val = parseInt(effect.split("-")[1], 10);
            setState(s => ({ ...s, health: Math.max(0, s.health - val) }));
            setMessages(msgs => [...msgs.slice(-4), `Health -${val}.`]);
        }
        // Add more effect types as needed
    }

    // Render
    return (
        <div className="podvigh-bg">
            {/* Map area */}
            <div className="podvigh-map-area">
                {/* <h2 className="podvigh-title">Podvigh</h2> */}
                {mapRows}
            </div>
            {/* Info panel */}
            <div className="podvigh-info-panel">
                <div className="podvigh-stats">
                    Faith: {state.faith} &nbsp; Health: {state.health}
                </div>
                <div className="podvigh-messages">
                    {(() => {
                        // combine the last few messages (and the ending if present) into one ASCII box
                        const recent = messages.slice(-3);
                        if (gameOver && ending) recent.push(ending);
                        const combined = recent.join('\n\n') || '';
                        const parts = String(combined).split('\n');
                        const maxLine = parts.reduce((m, p) => Math.max(m, String(p).length), 0);
                        const maxWidth = Math.min(60, Math.max(10, maxLine)); // adjust cap as desired
                        const border = '+' + '-'.repeat(maxWidth + 2) + '+';
                        return (
                            <div style={{ fontFamily: "Fira Mono, monospace", whiteSpace: "pre", marginBottom: "0.25rem" }}>
                                <div style={{ color: '#F20505' }}>{border}</div>
                                {parts.map((part, j) => {
                                    const isPrompt = /(^\(?Press\b)|(^\(Press)/i.test(part.trim());
                                    const safe = String(part).slice(0, maxWidth);
                                    const line = `| ${safe.padEnd(maxWidth)} |`;
                                    return (
                                        <div key={j} style={{ color: isPrompt ? '#F20505' : undefined }}>
                                            {line}
                                        </div>
                                    );
                                })}
                                <div style={{ color: '#F20505' }}>{border}</div>
                            </div>
                        );
                    })()}
                 </div>
                <div className="podvigh-controls">
                    Goal: Find the Sanctuary by growing your Faith. Explore and survive!
                </div>
                <div className="podvigh-controls">
                    Controls: Move (<b>WASD</b> / <b>Arrow keys</b>) | Interact (<b>G</b>)
                </div>
                {gameOver && (
                    <div className="podvigh-ending">
                    </div>
                )}
            </div>
        </div>
    );
};

const INTERACTION_OBJECTS_BY_ZONE = {
    "Forest": forestInteractions,
    "Ruins": ruinsInteractions,
    "Desert": desertInteractions
    // Add more as needed, e.g. "Mountains": mountainsInteractions
};

export default podvigh;