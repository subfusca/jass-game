// Card Data for Dental Care Card Game

const CARD_DATA = {
    patients: [
        {
            id: 'post-op-pain',
            name: 'Post-Op Pain',
            condition: 'Patient is experiencing pain after a dental procedure.',
            vulnerability: null,
            treatmentGoal: [
                { type: 'Analgesic', quantity: 1 }
            ]
        },
        {
            id: 'abscessed-tooth',
            name: 'Abscessed Tooth',
            condition: 'A tooth is severely infected and has an abscess.',
            vulnerability: null,
            treatmentGoal: [
                { type: 'Root Canal', quantity: 1 },
                { type: 'Anesthetic', quantity: 1 },
                { type: 'Antibiotic', quantity: 1 }
            ]
        },
        {
            id: 'routine-visit',
            name: 'Routine Visit',
            condition: 'Patient has minor plaque buildup.',
            vulnerability: null,
            treatmentGoal: [
                { type: 'Prophylaxis', quantity: 1 }
            ]
        },
        {
            id: 'wisdom-tooth-impaction',
            name: 'Wisdom Tooth Impaction',
            condition: 'A wisdom tooth is impacted and causing pain.',
            vulnerability: 'Patient has a heart condition.',
            treatmentGoal: [
                { type: 'Surgical Extraction', quantity: 1 },
                { type: 'Anesthetic without Epinephrine', quantity: 1 },
                { type: 'Analgesic', quantity: 1 }
            ]
        },
        {
            id: 'gingivitis',
            name: 'Gingivitis',
            condition: 'Gums are swollen, red, and bleed easily.',
            vulnerability: null,
            treatmentGoal: [
                { type: 'Scaling and Root Planing', quantity: 1 },
                { type: 'Oral Rinse', quantity: 1 }
            ]
        },
        {
            id: 'child-cavities',
            name: 'Child with Cavities',
            condition: 'Child has multiple cavities.',
            vulnerability: 'Pediatric patient, requires a gentle anesthetic.',
            treatmentGoal: [
                { type: 'Cavity Filling', quantity: 1 },
                { type: 'Topical Anesthetic', quantity: 1 },
                { type: 'Fluoride Varnish', quantity: 1 }
            ]
        },
        {
            id: 'missing-tooth',
            name: 'Missing Tooth',
            condition: 'Patient needs a tooth replaced with an implant.',
            vulnerability: 'Patient is a smoker, which can affect healing.',
            treatmentGoal: [
                { type: 'Dental Implant Surgery', quantity: 1 },
                { type: 'Anesthetic', quantity: 1 },
                { type: 'Antibiotic', quantity: 1 }
            ]
        },
        {
            id: 'dry-socket',
            name: 'Dry Socket',
            condition: 'Post-extraction pain due to the blood clot dissolving.',
            vulnerability: null,
            treatmentGoal: [
                { type: 'Pain Management', quantity: 1 },
                { type: 'Topical Anesthetic', quantity: 1 },
                { type: 'Antiseptic', quantity: 1 }
            ]
        },
        {
            id: 'oral-thrush',
            name: 'Oral Thrush',
            condition: 'White, creamy patches on the tongue and inner cheeks.',
            vulnerability: 'Often occurs in patients with a weakened immune system.',
            treatmentGoal: [
                { type: 'Antifungal Medication', quantity: 1 }
            ]
        },
        {
            id: 'jaw-pain',
            name: 'Jaw Pain',
            condition: 'Jaw joint pain and difficulty chewing.',
            vulnerability: 'Caused by stress and teeth grinding.',
            treatmentGoal: [
                { type: 'Appliance Therapy', quantity: 1 },
                { type: 'Muscle Relaxant', quantity: 1 }
            ]
        }
    ],

    procedures: [
        {
            id: 'pain-management',
            name: 'Pain Management',
            description: 'Provides relief from discomfort.',
            requirements: [
                { type: 'Analgesic', quantity: 1 }
            ],
            power: 'Relieves Pain'
        },
        {
            id: 'root-canal',
            name: 'Root Canal',
            description: 'Cleans and seals the infected pulp chamber of a tooth.',
            requirements: [
                { type: 'Anesthetic', quantity: 1 }
            ],
            power: 'Treats Infection, Saves Tooth'
        },
        {
            id: 'prophylaxis',
            name: 'Prophylaxis (Cleaning)',
            description: 'A professional cleaning to remove plaque and tartar.',
            requirements: [],
            power: 'Prevents Future Conditions'
        },
        {
            id: 'surgical-extraction',
            name: 'Surgical Extraction',
            description: 'A complex removal of an impacted tooth.',
            requirements: [
                { type: 'Anesthetic', quantity: 1 }
            ],
            power: 'Treats Severe Pain'
        },
        {
            id: 'scaling-root-planing',
            name: 'Scaling and Root Planing',
            description: 'Deep cleaning below the gumline.',
            requirements: [
                { type: 'Anesthetic', quantity: 1 }
            ],
            power: 'Treats Gum Disease'
        },
        {
            id: 'pediatric-filling',
            name: 'Pediatric Filling',
            description: 'A less invasive filling procedure for children.',
            requirements: [
                { type: 'Topical Anesthetic', quantity: 1 }
            ],
            power: 'Treats Cavities'
        },
        {
            id: 'dental-implant-surgery',
            name: 'Dental Implant Surgery',
            description: 'Surgically places an implant into the jawbone.',
            requirements: [
                { type: 'Anesthetic', quantity: 1 },
                { type: 'Antibiotic', quantity: 1 }
            ],
            power: 'Restores Function and Esthetics'
        },
        {
            id: 'dry-socket-treatment',
            name: 'Dry Socket Treatment',
            description: 'Irrigates the socket and applies a medicated dressing.',
            requirements: [
                { type: 'Topical Anesthetic', quantity: 1 },
                { type: 'Antiseptic', quantity: 1 }
            ],
            power: 'Relieves Pain, Promotes Healing'
        },
        {
            id: 'diagnosis-prescription',
            name: 'Diagnosis and Prescription',
            description: 'Identifies the fungal infection and prescribes medication.',
            requirements: [
                { type: 'Antifungal', quantity: 1 }
            ],
            power: 'Treats Fungal Infection'
        },
        {
            id: 'night-guard-therapy',
            name: 'Night Guard Therapy',
            description: 'Creating a custom appliance to prevent teeth grinding.',
            requirements: [
                { type: 'Muscle Relaxant', quantity: 1 }
            ],
            power: 'Treats Jaw Pain'
        }
    ],

    pharmacology: [
        {
            id: 'ibuprofen',
            name: 'Ibuprofen',
            type: 'Analgesic',
            effect: 'Reduces pain and inflammation.',
            specialCondition: 'Not for use with patients with kidney issues.'
        },
        {
            id: 'clindamycin',
            name: 'Clindamycin',
            type: 'Antibiotic',
            effect: 'Kills anaerobic bacteria common in dental infections.',
            specialCondition: 'May cause gastrointestinal side effects.'
        },
        {
            id: 'fluoride-varnish',
            name: 'Fluoride Varnish',
            type: 'Preventive Agent',
            effect: 'Strengthens tooth enamel to prevent cavities.',
            specialCondition: 'Must be applied after cleaning.'
        },
        {
            id: 'mepivacaine',
            name: 'Mepivacaine',
            type: 'Anesthetic',
            effect: 'A numbing agent that is less likely to affect the heart.',
            specialCondition: 'Does not contain epinephrine, making it safe for patients with heart conditions.'
        },
        {
            id: 'chlorhexidine',
            name: 'Chlorhexidine',
            type: 'Antiseptic Rinse',
            effect: 'Kills bacteria in the mouth.',
            specialCondition: 'Can temporarily stain teeth with prolonged use.'
        },
        {
            id: 'benzocaine-gel',
            name: 'Benzocaine Gel',
            type: 'Topical Anesthetic',
            effect: 'Numbs a small area on the surface of the gums.',
            specialCondition: 'For superficial use only, not for deep pain.'
        },
        {
            id: 'dexamethasone',
            name: 'Dexamethasone',
            type: 'Steroid',
            effect: 'Reduces inflammation and swelling after surgery.',
            specialCondition: 'Must be taken as directed to avoid side effects.'
        },
        {
            id: 'eugenol',
            name: 'Eugenol',
            type: 'Antiseptic',
            effect: 'An oily liquid with antiseptic and anesthetic properties.',
            specialCondition: 'Strong smell and taste.'
        },
        {
            id: 'nystatin',
            name: 'Nystatin',
            type: 'Antifungal',
            effect: 'An oral rinse used to treat fungal infections in the mouth.',
            specialCondition: 'Can be difficult for some patients to tolerate.'
        },
        {
            id: 'cyclobenzaprine',
            name: 'Cyclobenzaprine',
            type: 'Muscle Relaxant',
            effect: 'Relieves muscle spasms in the jaw.',
            specialCondition: 'Causes drowsiness, patient should not drive.'
        }
    ],

    easyModifiers: [
        {
            id: 'dental-assistant-aid',
            name: 'Dental Assistant\'s Aid',
            type: 'Support',
            effect: 'On your turn, you may draw one extra card from the deck.',
            use: 'Play this card at the start of your turn.'
        },
        {
            id: 'rush-order',
            name: 'Rush Order',
            type: 'Action',
            effect: 'You may use a Procedure Card with one fewer required Pharmacology Card this turn.',
            use: 'Play this card when you play a Procedure Card.'
        },
        {
            id: 'clinical-confidence',
            name: 'Clinical Confidence',
            type: 'Passive Ability',
            effect: 'You may ignore one "Special Condition" on a Pharmacology Card for a single turn.',
            use: 'Play this card to overcome a patient\'s vulnerability.'
        }
    ],

    challengingModifiers: [
        {
            id: 'patient-panic',
            name: 'Patient Panic',
            type: 'Event',
            effect: 'The target player must discard one random card from their hand.',
            use: 'Play this card on an opponent at any time.'
        },
        {
            id: 'supply-shortage',
            name: 'Supply Shortage',
            type: 'Event',
            effect: 'All players cannot use a specific type of Pharmacology Card (e.g., Anesthetics) for one full round.',
            use: 'Play this card at the start of a round.'
        },
        {
            id: 'unexpected-complication',
            name: 'Unexpected Complication',
            type: 'Event',
            effect: 'The target player\'s current patient now has a new "Vulnerability" (e.g., "now requires Antibiotic").',
            use: 'Play this card on an opponent after they have chosen their patient.'
        },
        {
            id: 'drug-resistance',
            name: 'Drug Resistance',
            type: 'Event',
            effect: 'The target player\'s current Antibiotic card is now ineffective. They must play a different one to meet the treatment goal.',
            use: 'Play this card on an opponent.'
        },
        {
            id: 'patient-faint',
            name: 'Patient Faint',
            type: 'Event',
            effect: 'The patient has fainted. The target player must skip their next turn as they wait for the patient to recover.',
            use: 'Play this card on an opponent.'
        },
        {
            id: 'anesthetic-failure',
            name: 'Anesthetic Failure',
            type: 'Event',
            effect: 'The Anesthetic used by the target player has failed to numb the area. They must discard their current Anesthetic card and play a new one.',
            use: 'Play this card on an opponent.'
        },
        {
            id: 'allergic-reaction',
            name: 'Allergic Reaction',
            type: 'Event',
            effect: 'The patient has an allergic reaction to a drug. The target player must discard their current Pharmacology card and draw a new Patient Card with a "Drug Allergy" vulnerability.',
            use: 'Play this card on an opponent.'
        },
        {
            id: 'equipment-malfunction',
            name: 'Equipment Malfunction',
            type: 'Event',
            effect: 'The dental drill or other equipment has stopped working. The target player must miss their next turn to "fix" the equipment.',
            use: 'Play this card on an opponent.'
        },
        {
            id: 'unexpected-bleeding',
            name: 'Unexpected Bleeding',
            type: 'Event',
            effect: 'The patient is bleeding more than expected. The target player must play a "Hemostatic Agent" card (if available) or miss a turn to manage the bleeding.',
            use: 'Play this card on an opponent.'
        },
        {
            id: 'patient-refusal',
            name: 'Patient Refusal',
            type: 'Event',
            effect: 'The patient becomes uncooperative. The target player must discard a card from their hand to calm the patient before they can continue.',
            use: 'Play this card on an opponent.'
        }
    ]
};

// Utility functions for card management
function shuffleDeck(deck) {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function drawCards(deck, count) {
    return deck.splice(0, count);
}

function createCardInstance(cardData, id) {
    return {
        ...cardData,
        instanceId: id || Math.random().toString(36).substr(2, 9),
        played: false
    };
}
