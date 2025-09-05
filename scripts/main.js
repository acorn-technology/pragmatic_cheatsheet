// Main application functionality
class PragmaticCheatsheet {
    constructor() {
        this.rawTips = [];
        this.processedTips = [];
        this.tipsContainer = document.getElementById('tips-grid');
        this.init();
    }

    async init() {
        try {
            await this.loadTips();
            this.processStories();
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
            this.rawTips = await response.json();
        } catch (error) {
            throw new Error('Failed to load tips data');
        }
    }

    processStories() {
        // Start with a deep copy of raw tips
        this.processedTips = JSON.parse(JSON.stringify(this.rawTips));
        
        // Clear all stories first - we'll redistribute them
        this.processedTips.forEach(tip => {
            tip.stories = [];
        });
        
        // Process each tip's original stories
        this.rawTips.forEach(tip => {
            tip.stories.forEach(story => {
                // Create enhanced story with source information
                const enhancedStory = {
                    ...story,
                    sourceTip: tip.number, // Track where this story originally came from
                    relatedTips: [...story.relatedTips] // Copy the array
                };
                
                // Add the source tip to relatedTips if not already there
                if (!enhancedStory.relatedTips.includes(tip.number)) {
                    enhancedStory.relatedTips.unshift(tip.number);
                }
                
                // Add this story to its home tip (source tip)
                const homeTip = this.processedTips.find(t => t.number === tip.number);
                if (homeTip) {
                    homeTip.stories.push({...enhancedStory, isHomeTip: true});
                }
                
                // Add this story to all related tips (cross-references)
                enhancedStory.relatedTips.forEach(relatedTipNum => {
                    if (relatedTipNum !== tip.number) { // Don't duplicate on home tip
                        const relatedTip = this.processedTips.find(t => t.number === relatedTipNum);
                        if (relatedTip) {
                            relatedTip.stories.push({
                                ...enhancedStory,
                                isHomeTip: false,
                                isXref: true
                            });
                        }
                    }
                });
            });
        });
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
        
        this.processedTips.forEach(tip => {
            const tipCard = this.createTipCard(tip);
            this.tipsContainer.appendChild(tipCard);
        });
    }

    createTipCard(tip) {
        const card = document.createElement('article');
        const hasStories = tip.stories && tip.stories.length > 0;
        
        // Apply visual status classes
        card.className = hasStories ? 'tip-card tip-card--has-stories' : 'tip-card tip-card--no-stories';
        card.setAttribute('data-tip-id', tip.number);
        
        card.innerHTML = `
            <div class="tip-card__header">
                <div class="tip-card__number">#${tip.number}</div>
                <h2 class="tip-card__title">${tip.title}</h2>
                <p class="tip-card__description">${tip.description}</p>
            </div>
            <div class="tip-card__actions">
                ${hasStories ? `
                    <button class="tip-card__expand-btn" aria-expanded="false" aria-controls="stories-${tip.number}">
                        ${tip.stories.length > 1 ? `View ${tip.stories.length} Stories` : 'View Story'}
                    </button>
                ` : `
                    <div class="tip-card__no-stories-text">
                        <p class="tip-card__contribute-text">No stories yet</p>
                    </div>
                `}
                <div class="tip-card__contribute-section">
                    <a href="#contribute" class="tip-card__contribute-link">Share your experience!</a>
                </div>
            </div>
            ${hasStories ? `
                <div class="tip-card__stories" id="stories-${tip.number}">
                    ${tip.stories.map((story, index) => this.createStoryHTML(story, index)).join('')}
                </div>
            ` : ''}
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
            <div class="tip-card__story ${story.isXref ? 'tip-card__story--xref' : ''}">
                ${story.isXref ? `
                    <div class="tip-card__story-source">
                        Story from <a href="#tip-${story.sourceTip}" class="tip-card__source-link" data-tip="${story.sourceTip}">
                            Tip #${story.sourceTip}
                        </a>
                    </div>
                ` : ''}
                <div class="tip-card__story-content">
                    ${story.content}
                </div>
                ${story.relatedTips && story.relatedTips.length > 0 ? `
                    <div class="tip-card__story-tags">
                        Related: ${story.relatedTips.map(tipNum => 
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
            // Collapse this card
            this.collapseCard(card, button, storiesContainer);
        } else {
            // First, collapse all other expanded cards
            this.collapseAllCards();
            
            // Then expand this card
            card.classList.add('tip-card--expanded');
            button.setAttribute('aria-expanded', 'true');
            // Set max-height to actual content height for smooth animation
            storiesContainer.style.maxHeight = storiesContainer.scrollHeight + 'px';
        }
    }

    collapseCard(card, button, storiesContainer) {
        card.classList.remove('tip-card--expanded');
        button.setAttribute('aria-expanded', 'false');
        storiesContainer.style.maxHeight = '0';
    }

    collapseAllCards() {
        const expandedCards = document.querySelectorAll('.tip-card--expanded');
        expandedCards.forEach(card => {
            const button = card.querySelector('.tip-card__expand-btn');
            const storiesContainer = card.querySelector('.tip-card__stories');
            this.collapseCard(card, button, storiesContainer);
        });
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
    if (e.target.matches('.tip-card__tag[data-tip], .tip-card__source-link[data-tip]')) {
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
    .tip-card__no-stories-text {
        padding: 1rem 1.5rem 0.5rem 1.5rem;
        text-align: center;
    }

    .tip-card__contribute-text {
        color: var(--text-secondary);
        font-size: 0.9rem;
        margin: 0;
    }

    .tip-card__contribute-link {
        display: inline-block;
        padding: 0.5rem 1rem;
        background-color: var(--accent-orange);
        color: white;
        text-decoration: none;
        border-radius: 6px;
        font-size: 0.85rem;
        font-weight: 500;
        transition: all 0.2s ease;
    }

    .tip-card__contribute-link:hover {
        background-color: var(--primary-color);
        transform: translateY(-1px);
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

    .tip-card__story--xref {
        border-left: 3px solid var(--primary-color);
        background-color: #f0f8f3;
    }

    .tip-card__story-source {
        font-size: 0.8rem;
        color: var(--text-secondary);
        margin-bottom: 0.5rem;
        font-style: italic;
    }

    .tip-card__source-link {
        color: var(--primary-color);
        text-decoration: none;
        font-weight: 500;
        transition: color 0.2s ease;
    }

    .tip-card__source-link:hover {
        color: var(--accent-teal);
        text-decoration: underline;
    }

    .tip-card__contribute-section {
        padding: 1rem 1.5rem 1.5rem 1.5rem;
        text-align: center;
        background-color: var(--background-accent);
        border-top: 1px solid var(--border-light);
    }
`;
document.head.appendChild(style);