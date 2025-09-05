// Main application functionality
class PragmaticCheatsheet {
    constructor() {
        this.tips = [];
        this.tipsContainer = document.getElementById('tips-grid');
        this.init();
    }

    async init() {
        try {
            await this.loadTips();
            this.renderTips();
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.showError('Failed to load tips. Please refresh the page.');
        }
    }

    async loadTips() {
        this.showLoading();
        
        try {
            const response = await fetch('./data/tips.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.tips = await response.json();
        } catch (error) {
            throw new Error('Failed to load tips data');
        }
    }

    showLoading() {
        this.tipsContainer.innerHTML = `
            <div class="loading">
                Loading tips...
            </div>
        `;
    }

    showError(message) {
        this.tipsContainer.innerHTML = `
            <div class="error">
                <p>${message}</p>
            </div>
        `;
    }

    renderTips() {
        this.tipsContainer.innerHTML = '';
        
        this.tips.forEach(tip => {
            const tipCard = this.createTipCard(tip);
            this.tipsContainer.appendChild(tipCard);
        });
    }

    createTipCard(tip) {
        const card = document.createElement('article');
        card.className = 'tip-card';
        card.setAttribute('data-tip-id', tip.number);

        const hasStories = tip.stories && tip.stories.length > 0;
        
        card.innerHTML = `
            <div class="tip-card__header">
                <div class="tip-card__number">#${tip.number}</div>
                <h2 class="tip-card__title">${tip.title}</h2>
                <p class="tip-card__description">${tip.description}</p>
            </div>
            ${hasStories ? `
                <button class="tip-card__expand-btn" aria-expanded="false" aria-controls="stories-${tip.number}">
                    ${tip.stories.length > 1 ? `View ${tip.stories.length} Stories` : 'View Story'}
                </button>
                <div class="tip-card__stories" id="stories-${tip.number}">
                    ${tip.stories.map((story, index) => this.createStoryHTML(story, index)).join('')}
                </div>
            ` : `
                <div class="tip-card__no-stories">
                    <p class="tip-card__contribute-text">No stories yet. <a href="#contribute" class="footer__link">Contribute your experience!</a></p>
                </div>
            `}
        `;

        // Add event listener for expand button
        if (hasStories) {
            const expandBtn = card.querySelector('.tip-card__expand-btn');
            expandBtn.addEventListener('click', () => this.toggleCard(card, expandBtn));
        }

        return card;
    }

    createStoryHTML(story, index) {
        return `
            <div class="tip-card__story">
                <div class="tip-card__story-content">
                    ${story.content}
                </div>
                ${story.relatedTips && story.relatedTips.length > 0 ? `
                    <div class="tip-card__story-tags">
                        ${story.relatedTips.map(tipNum => 
                            `<a href="#tip-${tipNum}" class="tip-card__tag" data-tip="${tipNum}">
                                Tip #${tipNum}
                            </a>`
                        ).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }

    toggleCard(card, button) {
        const isExpanded = card.classList.contains('tip-card--expanded');
        const storiesContainer = card.querySelector('.tip-card__stories');
        
        if (isExpanded) {
            // Collapse
            card.classList.remove('tip-card--expanded');
            button.setAttribute('aria-expanded', 'false');
            storiesContainer.style.maxHeight = '0';
        } else {
            // Expand
            card.classList.add('tip-card--expanded');
            button.setAttribute('aria-expanded', 'true');
            // Set max-height to actual content height for smooth animation
            storiesContainer.style.maxHeight = storiesContainer.scrollHeight + 'px';
        }
    }

    // Navigate to a specific tip (for cross-references)
    navigateToTip(tipNumber) {
        const targetCard = document.querySelector(`[data-tip-id="${tipNumber}"]`);
        if (targetCard) {
            targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Briefly highlight the card
            targetCard.style.outline = '2px solid #007acc';
            setTimeout(() => {
                targetCard.style.outline = '';
            }, 2000);
        }
    }
}

// Handle cross-reference clicks
document.addEventListener('click', (e) => {
    if (e.target.matches('.tip-card__tag[data-tip]')) {
        e.preventDefault();
        const tipNumber = parseInt(e.target.getAttribute('data-tip'));
        app.navigateToTip(tipNumber);
    }
});

// Initialize the app when DOM is ready
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new PragmaticCheatsheet();
});

// Add CSS for no-stories state
const style = document.createElement('style');
style.textContent = `
    .tip-card__no-stories {
        padding: 1.5rem;
        text-align: center;
        background-color: #f8f8f8;
        border-top: 1px solid #e5e5e5;
    }

    .tip-card__contribute-text {
        color: #666;
        font-size: 0.9rem;
        margin: 0;
    }

    .error {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 200px;
        color: #e74c3c;
        font-size: 1rem;
        text-align: center;
    }
`;
document.head.appendChild(style);