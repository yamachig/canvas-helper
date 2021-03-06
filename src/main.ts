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

    private directDetach() {
        if(this.detached) {
            this.transcriptEl.remove();
            this.transcriptWrapperEl.append(this.transcriptEl);
            const transcriptBody = this.transcriptEl.querySelector(".transcript-body") as HTMLElement;
            transcriptBody.style.height = transcriptBody.style.minHeight;
            transcriptBody.style.minHeight = "";
            this.detached = false;
            this.toggleDetachButton();
            if(this.window) {
                this.window.close();
                this.window = null;
            }
        } else {
            this.window = window.open(window.location.href, this.windowID, "resizable");
            if(!this.window) return;
            const w = this.window;
            const timer = setInterval(() => {
                try {
                    while(w.document.body.firstChild) {
                        w.document.body.removeChild(w.document.body.firstChild);
                    }
                    clearInterval(timer);
                } catch {
                    return;
                }
                this.transcriptEl.remove();
                w.document.body.append(this.transcriptEl);
                const showButton = this.transcriptEl.querySelector(".toggleTranscriptBodyWrapper") as HTMLElement;
                if(showButton.classList.contains("close")) {
                    showButton.click();
                }
                const style = w.document.createElement("style");
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
.transcriptInterface .transcription-time-part {
    display: block;
    border-bottom: 1px solid #EEEEEE;
}
`;
                w.document.head.append(style);
                const transcriptBody = this.transcriptEl.querySelector(".transcript-body") as HTMLElement;
                transcriptBody.style.minHeight = transcriptBody.style.height;
                transcriptBody.style.height = "auto";
        
                this.detached = true;
                this.toggleDetachButton();
                w.addEventListener("beforeunload", () => {
                    if(this.detached) this.directDetach();
                });
            }, 1000);
        }
    }

    private detachButtonClick: () => void;
    private _detachButtonClick() {
        this.directDetach();
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
    setTimeout(() => {
        activate();
    }, 2000);
};
window.addEventListener("load", onLoad);