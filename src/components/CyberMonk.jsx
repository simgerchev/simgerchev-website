import React, { useState, useRef, useEffect } from "react";
import monkAvatar from '../assets/project-pictures/cyber-monk/monk-avatar.png';
import gameForest from '../assets/project-pictures/cyber-monk/forest-game.png';
import fantasyForest from '../assets/project-pictures/cyber-monk/fantasy-forest-game.png';
import shadowGrove from '../assets/project-pictures/cyber-monk/shadow-grove.png';
import crystalCavern from '../assets/project-pictures/cyber-monk/crystal-cavern.png';
import ancientRuins from '../assets/project-pictures/cyber-monk/ancient-ruins.png';
import skyBridge from '../assets/project-pictures/cyber-monk/sky-bridge.png';
import graveyard from '../assets/project-pictures/cyber-monk/graveyard.png';

const LOCATIONS = {
	forest: {
		description: "You stand at the entrance to a mysterious forest. The path ahead looks inviting.",
		image: gameForest,
		exits: { forest_deeper: "forest_deeper" },
		parent: null
	},
	forest_deeper: {
		description: "You venture deeper into the forest. The trees grow denser and the air feels magical. Two paths lie ahead: one leads to a shadowy grove, the other to a glittering cavern.",
		image: fantasyForest,
		exits: { shadow_grove: 'shadow_grove', crystal_cavern: 'crystal_cavern' },
		parent: "forest"
	},
	shadow_grove: {
		description: "You enter a grove where the trees are twisted and the shadows seem alive. The path ends here, and you sense you should turn back. In the shadows, you spot a pair of Holy Goggles [holy-goggles.sh].\n\nA whisper in the shadows: 'If you want to interact with objects or NPCs, write bash object-name.sh or npc-name.sh.'",
		image: shadowGrove,
		exits: { '.graveyard': '.graveyard' }, // .graveyard always present
		parent: "forest_deeper",
		items: {
			'holy-goggles.sh': "#!/bin/bash\necho 'You put on the holy goggles. Suddenly, hidden places shimmer into view! You have learned the secret of the ls -la command.'"
		}
	},
	".graveyard": {
		description: "A hidden graveyard shrouded in mist. Ancient tombstones line the ground, and the air is thick with mystery.",
		image: graveyard,
		exits: { '.crypt': '.crypt' }, // .crypt only accessible from .graveyard
		parent: "shadow_grove"
	},
	".crypt": {
		description: "A hidden crypt lies beneath the grove, filled with ancient bones and forgotten secrets. The air is cold and heavy.",
		image: graveyard, // Replace with a crypt image if available
		exits: {},
		parent: ".graveyard"
	},
	crystal_cavern: {
		description: "A cavern glittering with giant crystals. The air hums with magical energy and a faint path leads deeper. On the floor, you spot a shimmering Crystal Lens [crystal-lens.sh], and a dusty Note [note.txt].",
		image: crystalCavern,
		exits: { ancient_ruins: 'ancient_ruins' },
		parent: "forest_deeper",
		items: {
			'note.txt': "Welcome, traveler! If you can read this, you have mastered the art of the cat command. Seek the secrets hidden in the ruins beyond.",
			'crystal-lens.sh': "#!/bin/bash\necho 'You take the crystal lens and learn to read with it.'"
		},
		unlocks: 'cat'
	},
	ancient_ruins: {
		description: "Moss-covered ruins of a forgotten civilization. Strange symbols glow faintly on the stone walls.",
		image: ancientRuins,
		exits: { sky_bridge: 'sky_bridge', '.secret-chamber': '.secret-chamber' }, // .secret-chamber always present
		parent: "crystal_cavern"
	},
	".secret-chamber": {
		description: "A hidden chamber behind a crumbling wall. Ancient artifacts and mysterious glyphs cover the surfaces, hinting at lost knowledge.",
		image: ancientRuins, // Replace with a secret chamber image if available
		exits: {},
		parent: "ancient_ruins"
	},
	sky_bridge: {
		description: "A narrow bridge of clouds connects two floating islands high above the world. The view is breathtaking.",
		image: skyBridge,
		exits: {},
		parent: "ancient_ruins"
	}
};

const INITIAL_STATE = {
    location: "forest",
    history: [],
    unlocked: [],
    visited: ["forest"] // Mark the starting location as visited
};

function getPrompt(state) {
	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		return `m@f:${state.location}$`;
	}
	return `monk@fantasy:${state.location}$`;
}

export default function CyberMonk() {
						// Load progression from localStorage if available
						const savedState = (() => {
							try {
								const raw = localStorage.getItem('cyberMonkState');
								return raw ? JSON.parse(raw) : null;
							} catch {
								return null;
							}
						})();
						const [lines, setLines] = useState([
							"Welcome, CyberMonk!",
							"You hold a book containing all the movements and actions you know.",
							"Open your book with the 'help' command to see your options.",
							LOCATIONS[savedState?.location || INITIAL_STATE.location].description,
							"Type 'ls' to see available paths, 'cd forest_deeper' to enter the forest, 'cd ..' to go back, or 'help' to open your book."
						]);
						const [input, setInput] = useState("");
						const [state, setState] = useState(savedState || INITIAL_STATE);
						const terminalRef = useRef(null);

	useEffect(() => {
		if (terminalRef.current) {
			terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
		}
	}, [lines]);

	function handleCommand(cmdLine) {
						let parts = cmdLine.trim().split(/\s+/);
						let cmd = parts[0];
						let args = parts.slice(1);
						// Special handling for 'ls -la' as a single command
						if (cmd === 'ls' && args[0] === '-la') {
							cmd = 'ls -la';
							args = args.slice(1);
						}
						let output = "";
						let newState = { ...state };
						switch (cmd) {
							case "reset":
								localStorage.removeItem('cyberMonkState');
								setState(INITIAL_STATE);
								setLines([
									"Welcome, CyberMonk!",
									"You hold a book containing all the movements and actions you know.",
									"Open your book with the 'help' command to see your options.",
									LOCATIONS[INITIAL_STATE.location].description,
									"Type 'ls' to see available paths, 'cd forest_deep' to enter the forest, 'cd ..' to go back, or 'help' to open your book."
								]);
								return;
							case "help":
								const helpCommands = [
									"You open your book. Available movements and actions:",
									"- cd <location>: Change to a new location (e.g. cd forest_deeper, cd crystal_cavern).",
									"- cd ..: Go to the previous location.",
									"- ls: List available paths from your location.",
									state.unlocked.includes('ls -la') ? "- ls -la: List all paths, including hidden ones." : null,
									"- pwd: Show your current location.",
									state.unlocked.includes('cat') ? "- cat <file>: Read notes and books you find." : null,
									"- bash <item>.sh: Interact with items or NPCs.",
									"- help: Open your book of movements.",
									"- clear: Clear the terminal.",
									"- reset: Reset your progress and start over."
								].filter(Boolean);
								// Output each command as a separate line in the terminal
								helpCommands.forEach(cmd => setLines(prev => [...prev, cmd]));
								return;
							case "ls": {
								const loc = LOCATIONS[state.location];
								// Always hide hidden locations (starting with a dot)
								const exits = Object.keys(loc.exits)
									.filter(dir => !dir.startsWith('.'))
									.map(dir => dir + '/');
								const items = loc.items ? Object.keys(loc.items) : [];
								const all = [...exits, ...items];
								output = all.length > 0 ? all.join('  ') : "";
								break;
							}
							case "ls -la": {
								if (!state.unlocked.includes('ls -la')) {
									output = "Unknown command. Type 'help' to open your book.";
								} else {
									const loc = LOCATIONS[state.location];
									// Show all exits, including hidden ones (starting with a dot)
									const exits = Object.keys(loc.exits).map(dir => dir + '/');
									const items = loc.items ? Object.keys(loc.items) : [];
									const all = [...exits, ...items];
									output = all.length > 0 ? all.join('  ') : "";
								}
								break;
							}
							case "pwd":
								output = state.location;
								break;
							case "cd":
								const dir = args[0];
								if (dir === "..") {
									const parent = LOCATIONS[state.location].parent;
									if (parent) {
										newState.history = [...(state.history || []), state.location];
										newState.location = parent;
										// Only show description if not visited
										if (!newState.visited?.includes(parent)) {
											output = LOCATIONS[parent].description;
											newState.visited = [...(newState.visited || []), parent];
										} else {
											output = `You move to ${parent}.`;
										}
										// Unlock command if present, but skip 'cat' (only unlock via bash crystal-lens.sh)
										if (LOCATIONS[newState.location].unlocks && LOCATIONS[newState.location].unlocks !== 'cat' && !state.unlocked.includes(LOCATIONS[newState.location].unlocks)) {
											newState.unlocked = [...state.unlocked, LOCATIONS[newState.location].unlocks];
											output += `\nYou have discovered the secret of the '${LOCATIONS[newState.location].unlocks}' command!`;
										}
									} else {
										output = "No previous location.";
									}
								} else {
									const exitsObj = LOCATIONS[state.location].exits;
									if (exitsObj && exitsObj[dir]) {
										newState.history = [...(state.history || []), state.location];
										newState.location = exitsObj[dir];
										// Only show description if not visited
										if (!newState.visited?.includes(exitsObj[dir])) {
											output = LOCATIONS[exitsObj[dir]].description;
											newState.visited = [...(newState.visited || []), exitsObj[dir]];
										} else {
											output = `You move to ${exitsObj[dir]}.`;
										}
										// Show voice message if entering crystal_cavern
										if (exitsObj[dir] === "crystal_cavern" && !newState.visited?.includes(exitsObj[dir])) {
											output += "\n\nA mysterious voice echoes in the cavern: 'If you wish to interact with items or NPCs, type bash item_name.sh or bash npc_name.sh.'";
										}
										// Unlock command if present, but skip 'cat' (only unlock via bash crystal-lens.sh)
										if (LOCATIONS[exitsObj[dir]].unlocks && LOCATIONS[exitsObj[dir]].unlocks !== 'cat' && !state.unlocked.includes(LOCATIONS[exitsObj[dir]].unlocks)) {
											newState.unlocked = [...state.unlocked, LOCATIONS[exitsObj[dir]].unlocks];
											// Do not show the 'cat' secret message here; it will be shown after bash crystal-lens.sh
										}
									} else {
										output = "No such path.";
									}
								}
								break;
							case "cat":
								if (!state.unlocked.includes('cat')) {
									output = "Unknown command. Type 'help' to open your book.";
								} else {
									const loc = LOCATIONS[state.location];
									const file = args[0];
									if (loc.items && loc.items[file]) {
										output = loc.items[file];
									} else {
										output = `No such file '${file}' here.`;
									}
								}
								break;
							case "bash": {
								const loc = LOCATIONS[state.location];
								const script = args[0];
								if (loc.items && loc.items[script] && script.endsWith('.sh')) {
									if (script === "crystal-lens.sh") {
										output = "You take the crystal lens and learn to read with it.\n\nYou have discovered the secret of the 'cat' command!\nYou can now read notes and books you find.\nUsage: cat <file>\nTry it now with: cat note.txt";
										if (!state.unlocked.includes('cat')) {
											newState.unlocked = [...state.unlocked, 'cat'];
										}
									} else if (script === "holy-goggles.sh") {
										output = "You put on the holy goggles. Suddenly, hidden places shimmer into view!\nYou have discovered the secret of the 'ls -la' command!\nYou can now find hidden rooms in shadowy places.\nUsage: ls -la";
										if (!state.unlocked.includes('ls -la')) {
											newState.unlocked = [...state.unlocked, 'ls -la'];
										}
									} else {
										output = loc.items[script];
									}
								} else {
									output = "bash: command not found or script not available here.";
								}
								break;
							}
							case "clear":
								setLines([]);
								return;
							default:
								output = "Unknown command. Type 'help' to open your book.";
						}
			setState(newState);
			setLines(prev => [...prev, `${getPrompt(state)} ${cmdLine}`, output]);
			// Save progression to localStorage
			try {
				localStorage.setItem('cyberMonkState', JSON.stringify(newState));
			} catch {}
	}

	function isMobileDevice() {
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	}

	function handleInput(e) {
		setInput(e.target.value);
	}

	function handleKeyDown(e) {
		if (e.key === "Enter") {
			handleCommand(input);
			setInput("");
		}
	}


	const inputRef = useRef(null);
		const renderInputWithCursor = () => (
			<div className="cybermonk-input-container">
				<span className="cybermonk-arrow">&gt;</span>
				<div className="cybermonk-input-measure-container" style={{position: 'relative', flex: 1, display: 'flex', alignItems: 'center'}}>
					<input
						ref={inputRef}
						type="text"
						className="cybermonk-input"
						value={input}
						onChange={handleInput}
						onKeyDown={handleKeyDown}
						autoFocus
					/>
				</div>
			</div>
		);

				return (
					<div className="cybermonk-flex-container">
						<div className="cybermonk-terminal">
							<div className="cybermonk-lines" ref={terminalRef}>
								{lines.map((line, idx) => (
									<div key={idx}>{line}</div>
								))}
							</div>
							<div className="cybermonk-input-row">
								<span className="cybermonk-prompt">{getPrompt(state)}</span>
								{renderInputWithCursor()}
							</div>
						</div>
										<div className="cybermonk-side-screen">
											<img src={LOCATIONS[state.location].image} alt={state.location + " Game"} className="cybermonk-forest-img" />
											<div className="cybermonk-side-flex">
												<img src={monkAvatar} alt="Monk Avatar" className="cybermonk-monk-avatar" />
												<div>
													<h2 className="cybermonk-side-title">Monk Info</h2>
													<p>Location: <strong>{state.location}</strong></p>
													  <p><strong>Unlocked commands:</strong> {state.unlocked.length > 0 ? state.unlocked.join(', ') : 'None yet'}</p>
												</div>
											</div>
										</div>
					</div>
				);
	}
