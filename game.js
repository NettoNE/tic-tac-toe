// GAME RULES
const winningPositions = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6],
]

export default function game() {
	let table = [0, 1, 2, 3, 4, 5, 6, 7, 8]

	const playerX = createPlayer("❌")
	const playerO = createPlayer("⭕")

	// STATE INTERFACES
	let drawState = false
	let winnerState = false

	// PLAYER FACTORY
	function createPlayer(playerMark) {
		return {
			playerMark,
			playedCounter: 0,
			positionsPlayed: [],
		}
	}

	function defineActualPlayer() {
		if (
			playerX.playedCounter == playerO.playedCounter ||
			playerO.playedCounter > playerX.playedCounter
		) {
			return playerX
		}
		return playerO
	}

	function isValidOption(playerOption) {
		// Concat players positionsPlayed
		const concatPositionsPlayed = playerX.positionsPlayed.concat(
			playerO.positionsPlayed,
		)

		if (
			!table.includes(Number(playerOption)) ||
			concatPositionsPlayed.includes(Number(playerOption))
		) {
			console.log(
				"GAME CORE isValidOption(): This option has already been played!",
			)
			return false
		}

		return true
	}

	function winnerLogic(actualPlayer) {
		for (let el of winningPositions) {
			if (
				el.every((position) => actualPlayer.positionsPlayed.includes(position))
			) {
				console.log(`Winner: ${actualPlayer.playerMark}`)

				// STATE INTERFACE
				winnerState = true
				return true
			}
		}

		return false
	}

	function drawLogic() {
		const draw = table.filter((el) => typeof el === "number")

		if (draw.length === 0) {
			console.log("Draw!")

			// STATE INTERFACE
			drawState = true
			return true
		}

		return false
	}

	function getGameState() {
		// STATE INTERFACE
		return { drawState, winnerState }
	}

	// DEBUG SUTFF
	function printConsole(actualPlayer) {
		console.log(
			`>>> GAME CORE printConsole(): TABLE ON CONSOLE | PLAYED BY: ${actualPlayer.playerMark} <<< \n [${table.slice(0, 3)}]\n [${table.slice(3, 6)}]\n [${table.slice(6, 9)}]`,
		)
	}

	function play(playerOption) {
		if (winnerState || drawState) return

		if (!isValidOption(playerOption)) {
			console.log("GAME CORE PLAY(): ERROR")
			return
		}

		// DEFINITIONS
		const actualPlayer = defineActualPlayer()

		// DEBUG STUFF
		// console.log(actualPlayer)

		// TABLE LOGIC
		table[table.findIndex((el) => el == playerOption)] = actualPlayer.playerMark

		// Store played position in "player object"
		actualPlayer.positionsPlayed.push(Number(playerOption))

		// playedCounter property increment
		actualPlayer.playedCounter++

		// WIN OR DRAW LOGIC
		if (winnerLogic(actualPlayer) || drawLogic()) return

		// DEBUG STUFF (KEEP IT!)
		printConsole(actualPlayer)
	}

	return { play, getGameState, defineActualPlayer }
}
