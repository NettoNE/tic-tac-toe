import game from "./game.js"

// Assets to UI
const svgX = `<svg viewBox="0 0 100 100" width="32px" height="32px" style="vertical-align: middle; flex-shrink: 0; "xmlns="http://www.w3.org/2000/svg"> <line x1="25" y1="25" x2="75" y2="75" stroke="#ff4757" stroke-width="8" stroke-linecap="round" /> <line x1="75" y1="25" x2="25" y2="75" stroke="#ff4757" stroke-width="8" stroke-linecap="round" /> </svg>`
const svgO = `<svg viewBox="0 0 100 100" width="32px" height="32px" style="vertical-align: middle; flex-shrink: 0;" xmlns="http://www.w3.org/2000/svg"> <circle cx="50" cy="50" r="25" stroke="#2ed573" stroke-width="8" fill="none" /> </svg>`

const gameSession = game()

document.addEventListener("DOMContentLoaded", () => {
	mountUI()
})

function mountUI() {
	const gameTableElement = document.querySelector("game-table")

	// DEBUG STUFF
	window.gameTableElement = gameTableElement

	// Components divs
	const gameTableDivs = gameTableElement.shadowRoot.querySelector("div")
	const gameTableDivsArray = Array.from(gameTableDivs.children)

	gameTableDivsArray.forEach((el) => {
		el.addEventListener("click", (event) => {
			// ACTUAL PLAYER
			const actualPlayer = gameSession.defineActualPlayer()

			changeGameTableHeader(`Last Player: ${actualPlayer.playerMark}`)

			// PLAY
			gameSession.play(event.currentTarget.dataset.index)

			// GAME STOP LOGIC (UI)
			const { drawState, winnerState } = gameSession.getGameState()

			if (winnerState) {
				console.log("GAME UI: WIN")

				stopGameUI()

				changeGameTableHeader(`WINNER: ${actualPlayer.playerMark}`)

				return
			}

			if (drawState) {
				console.log("GAME UI: DRAW")

				stopGameUI()

				changeGameTableHeader(`DRAW`)

				return
			}

			// DEBUG STUFF
			// console.log(event.currentTarget.dataset.index)
		})
	})
}

function stopGameUI() {
	// "little" overlay
	const overlay = document.createElement("div")

	Object.assign(overlay.style, {
		position: "fixed",
		inset: "0",
		zIndex: "9999",
		cursor: "not-allowed"
	})

	document.body.appendChild(overlay)
}

function changeGameTableHeader(msg) {
    const gameTableHead = gameTableElement.shadowRoot.querySelector("h1")

    msg = msg
        .replace("❌", svgX)
        .replace("⭕", svgO)

    Object.assign(gameTableHead.style, {
        display: "flex",
        alignItems: "center",
        gap: "10px",
    })

    gameTableHead.innerHTML = msg
}

// Game Table Component
class GameTable extends HTMLElement {
	constructor() {
		super()
		this.markCounter = 0
		this.attachShadow({ mode: "open" })
	}

	connectedCallback() {
		this.render()
	}

	render() {
		this.shadowRoot.innerHTML = `
		<style>
			* {
				font-family:
					BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif,
					"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
			}
		</style>
		`

		const tableUI = document.createElement("div")

		Object.assign(tableUI.style, {
			minHeight: "70dvh",
			width: "min(50rem, 90vw)",
			aspectRatio: "1 / 1",
			display: "grid",
			gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
			gridTemplateRows: "repeat(3, minmax(0, 1fr))",
			boxSizing: "border-box",
			border: "1px solid gray",
		})

		const tableUIHead = document.createElement("h1")

		Object.assign(tableUIHead.style, {
			color: "#FFA07A",
			fontWeight: "bold",
			
			// UI Trick 
			position: "absolute",
		})

		for (let i = 0; i < 9; i++) {
			const cell = document.createElement("div")

			Object.assign(cell.style, {
				border: "1px solid grey",
			})

			Object.assign(cell.dataset, {
				index: i,
				mark: "",
			})

			cell.addEventListener("click", (event) => {
				let mark

				if (cell.querySelector("span")) return

				const svgX = `<svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><line x1="20" y1="20" x2="80" y2="80" stroke="#ff4757" stroke-width="12" stroke-linecap="round" /><line x1="80" y1="20" x2="20" y2="80" stroke="#ff4757" stroke-width="12" stroke-linecap="round" /></svg>`
				const svgO = `<svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="30" stroke="#2ed573" stroke-width="12" fill="none" stroke-linecap="round" /></svg>`

				// MARK LOGIC
				if (this.markCounter == 0 || this.markCounter % 2 == 0) mark = svgX
				if (this.markCounter == 1 || this.markCounter % 2 != 0) mark = svgO

				let span = document.createElement("span")

				span.innerHTML = `${mark}`

				cell.appendChild(span)

				this.markCounter++
			})

			tableUI.appendChild(cell)
		}
		// TABLE DIV (main)
		this.shadowRoot.appendChild(tableUI)

		// TABLE H1
		this.shadowRoot.appendChild(tableUIHead)
	}
}

customElements.define("game-table", GameTable)
