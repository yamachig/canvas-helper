import "./manifest.json";
import "./16.png";
import "./48.png";
import "./128.png";

class TranscriptManager {
    private transcriptWrapperEl: HTMLElement;
    private transcriptEl: HTMLElement;
    private detachButton: HTMLAnchorElement;
    private window: Window | null = null;

    private detached = false;

    private windowID: string;

    private constructor(transcriptWrapperEl: HTMLElement) {
        this.transcriptWrapperEl = transcriptWrapperEl;
        this.transcriptEl = transcriptWrapperEl.getElementsByClassName("transcriptInterface")[0] as HTMLElement;
        this.windowID = `canvas_transcript_${Math.floor(Math.random() * 100000000)}`;
        this.detachButtonClick = () => this._detachButtonClick();
        this.detachButton = transcriptWrapperEl.ownerDocument.createElement("a");
    }
    static generate() {
        const transcriptWrapperEl = document.getElementById("transcript-player-plugin");
        if(!transcriptWrapperEl) return;
        else return new TranscriptManager(transcriptWrapperEl);
    }

    public activate() {
        this.detachButton.href = "#";
        this.detachButton.classList.add("active-elements");
        this.detachButton.style.width = "auto";
        this.detachButton.addEventListener("click", this.detachButtonClick);
        this.toggleDetachButton();

        const detachButtonWrapper = document.createElement("div");
        detachButtonWrapper.classList.add("transcript-menu-item");
        detachButtonWrapper.style.lineHeight = "1em";
        detachButtonWrapper.append(this.detachButton);

        const lastButton = this.transcriptEl.querySelector(".transcript-menu > .toggleTranscriptBodyWrapper");
        if(lastButton) {
            lastButton.parentElement?.insertBefore(detachButtonWrapper, lastButton);
        }
    }

    private toggleDetachButton() {
        this.detachButton.text = this.detached ? "merge to parent window" : "detach";
    }

    private detachButtonClick: () => void;
    private _detachButtonClick() {
        if(this.detached) {
            this.transcriptEl.remove();
            this.transcriptWrapperEl.append(this.transcriptEl);
            const transcriptBody = this.transcriptEl.querySelector(".transcript-body") as HTMLElement;
            transcriptBody.style.height = transcriptBody.style.minHeight;
            transcriptBody.style.minHeight = "";
            this.detached = false;
            if(this.window) {
                this.window.close();
                this.window = null;
            }
        } else {
            this.window = window.open("", this.windowID, "resizable");
            if(!this.window) return;
            this.transcriptEl.remove();
            this.window.document.body.append(this.transcriptEl);
            const showButton = this.transcriptEl.querySelector(".toggleTranscriptBodyWrapper") as HTMLElement;
            if(showButton.classList.contains("close")) {
                showButton.click();
            }
            const style = this.window.document.createElement("style");
            style.textContent = `
body {
    margin: 0;
}
.transcriptInterface {
    height: 100vh;
    display: flex;
    flex-direction: column;
}
.transcriptInterface .transcript-box {
    overflow-y: auto;
    padding: 0;
}
.transcriptInterface .transcript-body {
    overflow: unset;
    overflow-y: auto;
}
`;
            this.window.document.head.append(style);
            const transcriptBody = this.transcriptEl.querySelector(".transcript-body") as HTMLElement;
            transcriptBody.style.minHeight = transcriptBody.style.height;
            transcriptBody.style.height = "auto";

            this.detached = true;
            this.window.addEventListener("beforeunload", () => {
                if(this.detached) this.detachButtonClick();
            });
        }
        this.toggleDetachButton();
    }
}

const activate = () => {
    const transcript = TranscriptManager.generate();
    if(!transcript) {
        return;
    }
    transcript.activate();
};

const onLoad = () => {
    activate();
};
window.addEventListener("load", onLoad);