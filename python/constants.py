# constants definition
DATA_PATH = "data/"
VIDEOS_PATH = DATA_PATH + "videos/"
DATAFRAMES_PATH = DATA_PATH + "dataframes/"
NB_VIDEOS = 3

ANSWERS_DICT = {"i1":"fake/natural", "ii2":"stagnant/lively", "ii5":"inert/interactive", 
                   "i3":"unconscious/conscious", "iv1":"incompetent/competent", 
                   "iv4":"unintelligent/intelligent", "ii3":"mechanical/organic", 
                   "ii6":"unresponsive/responsive", "iv5":"foolish/sensible", 
                   "iv2":"ignorant/knowledgeable", "i2":"machinelike/humanlike", 
                   "i4":"artificial/lifelike", "ii1":"dead/alive", "iii4":"unpleasant/pleasant",
                   "i5":"ridig/smooth", "iii1":"dislike/like", "iv3":"irresponsible/responsible",
                   "iii5":"awful/nice", "iii2":"unfriendly/friendly", "iii3":"unkind/kind"}

ANSWERS_COLUMNS = ["fake/natural", "stagnant/lively", "inert/interactive", 
                   "unconscious/conscious", "incompetent/competent", 
                   "unintelligent/intelligent", "mechanical/organic", 
                   "unresponsive/responsive", "foolish/sensible", 
                   "ignorant/knowledgeable", "machinelike/humanlike", 
                   "artificial/lifelike", "dead/alive", "unpleasant/pleasant",
                   "ridig/smooth", "dislike/like", "irresponsible/responsible",
                   "awful/nice", "unfriendly/friendly", "unkind/kind"]

NB_QUESTIONS = len(ANSWERS_COLUMNS)

ANTHROPOMORPHISM_COLUMNS = ["fake/natural", "machinelike/humanlike", 
                            "unconscious/conscious", "artificial/lifelike",
                            "ridig/smooth"]
ANIMACY_COLUMNS = ["dead/alive", "stagnant/lively", "mechanical/organic",
                   "inert/interactive", "artificial/lifelike",
                   "unresponsive/responsive"]
LIKEABILITY_COLUMNS = ["dislike/like", "unfriendly/friendly",
                       "unkind/kind", "unpleasant/pleasant",
                       "awful/nice"]
INTELLIGENCE_COLUMNS = ["incompetent/competent", "ignorant/knowledgeable",
                        "irresponsible/responsible", "unintelligent/intelligent",
                        "foolish/sensible"]

IMPRESSIONS = {"Anthropomorphism": ANTHROPOMORPHISM_COLUMNS, 
               "Animacy":ANIMACY_COLUMNS, 
               "Likeability":LIKEABILITY_COLUMNS,
               "Intelligence":INTELLIGENCE_COLUMNS}

FEATURES = ['smile', 'innerBrowRaise', 'browRaise', 'browFurrow', 'noseWrinkle',
       'upperLipRaise', 'lipCornerDepressor', 'chinRaise', 'lipPucker',
       'lipPress', 'lipSuck', 'mouthOpen', 'smirk', 'eyeClosure', 'attention',
       'lidTighten', 'jawDrop', 'dimpler', 'eyeWiden', 'cheekRaise',
       'lipStretch']

IGNORED_FEATURES = ['attention', 'lidTighten', 'jawDrop', 'dimpler', 
                    'eyeWiden', 'cheekRaise', 'lipStretch']

CONSIDERED_FEATURES = ['smile', 'innerBrowRaise', 'browRaise', 'browFurrow', 'noseWrinkle',
       'upperLipRaise', 'lipCornerDepressor', 'chinRaise', 'lipPucker',
       'lipPress', 'lipSuck', 'mouthOpen', 'smirk', 'eyeClosure']