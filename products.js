/* ASY Store — catalogue par défaut (utilisé tant que Firebase n'est pas configuré).
   Ajouter des photos à un produit : compléter son tableau images (la première est la photo principale).
   Les descriptions ont été rédigées d'après les photos : à faire valider par la boutique. */
var ASY_PRODUCTS = [
    {
        id: 1, cat: "classique", spec: "int", price: "4 500 DA",
        images: ["Products/660512119_964583239865226_8198389326246780176_n.jpg"],
        name: { fr: "Applique Abat-jour Classique Or", ar: "أبليك كلاسيكي ذهبي", en: "Classic Gold Shade Sconce" },
        desc: {
            fr: "Un anneau lumineux au dessin épuré : la moitié haute s'illumine d'une lumière douce, tandis que la moitié basse, en finition noir mat, se fixe sur une platine rectangulaire noire. Un petit panneau de boutons (marche/arrêt, + et −) est intégré directement sur l'applique. Une touche moderne et graphique pour un salon, une chambre ou un couloir.",
            ar: "حلقة مضيئة بتصميم بسيط وأنيق: نصفها العلوي يشعّ بضوء ناعم، ونصفها السفلي بلون أسود مطفأ مثبّت على قاعدة مستطيلة سوداء. تضمّ القاعدة لوحة أزرار صغيرة للتشغيل والإطفاء مع زرّين + و−. لمسة عصرية ذات طابع هندسي تناسب الصالون أو غرفة النوم أو الممر.",
            en: "A luminous ring with a clean, minimal design: the upper half glows with a soft light, while the lower half, in a matte black finish, is fixed to a black rectangular back plate. A small button panel (on/off, + and −) is built right into the fixture. A modern, graphic touch for a living room, bedroom or hallway."
        }
    },
    {
        id: 2, cat: "classique", spec: "int", price: "4 200 DA",
        images: ["Products/661454881_964582986531918_5483709476643133918_n.jpg"],
        name: { fr: "Applique Abat-jour Chrome", ar: "أبليك كرومي", en: "Chrome Shade Sconce" },
        desc: {
            fr: "Un panneau rectangulaire translucide aux angles adoucis, traversé en son centre par un bandeau à finition argentée brossée. La lumière chaude s'échappe vers le haut et vers le bas, fait rayonner tout le panneau et dessine un halo doux sur le mur. Un modèle sobre et contemporain pour un couloir, une entrée, un escalier ou une chambre.",
            ar: "لوح مستطيل نصف شفاف بزوايا ناعمة، يتوسّطه شريط أفقي بلون فضي ولمسة معدنية ناعمة. تنساب الإضاءة الدافئة نحو الأعلى والأسفل فيتوهّج اللوح بأكمله ويرسم هالة لطيفة على الجدار. تصميم عصري هادئ يناسب الممر والمدخل والدرج وغرفة النوم.",
            en: "A translucent rectangular panel with softened corners, crossed at its centre by a band in a brushed silver finish. Warm light escapes upwards and downwards, making the whole panel glow and drawing a soft halo on the wall. A sober, contemporary piece for a hallway, entrance, staircase or bedroom."
        }
    },
    {
        id: 3, cat: "classique", spec: "int", price: "4 500 DA",
        images: ["Products/661710772_964583469865203_6823182422207281289_n.jpg"],
        name: { fr: "Applique Abat-jour Noir Mat", ar: "أبليك أسود مات", en: "Matte Black Shade Sconce" },
        desc: {
            fr: "Une applique plate en forme d'ovale allongé, en finition noir mat, traversée par une fine ligne lumineuse verticale. Un halo se diffuse aussi à l'arrière, sur le mur, pour une ambiance tamisée. Un panneau de boutons (marche/arrêt, + et −) est intégré sur le devant : un choix pratique en tête de lit, dans une chambre ou un couloir.",
            ar: "إضاءة جدارية مسطّحة على شكل بيضاوي مستطيل بلون أسود مطفأ، يشقّها خط ضوئي عمودي رفيع. وتنبعث من خلفها هالة ضوئية على الجدار تمنح المكان أجواء هادئة. تحتوي واجهتها على أزرار للتشغيل والإطفاء مع زرّين + و−، ما يجعلها عملية بجانب السرير في غرفة النوم أو في الممر.",
            en: "A flat, elongated oval sconce in a matte black finish, cut through by a slim vertical line of light. A soft glow also spills from behind onto the wall, creating a calm, dimmed atmosphere. A button panel (on/off, + and −) is built into the front, making it practical beside the bed, in a bedroom or a hallway."
        }
    },
    {
        id: 4, cat: "classique", spec: "int", price: "5 000 DA",
        images: ["Products/661715173_964583323198551_6902706529067766289_n.jpg"],
        name: { fr: "Applique Classique Double", ar: "أبليك كلاسيكي مزدوج", en: "Double Classic Sconce" },
        desc: {
            fr: "Une composition verticale graphique : un bloc carré noir d'où partent deux tiges noires décalées, encadrant un tube lumineux blanc. La lumière chaude s'échappe vers le haut et vers le bas et souligne la silhouette élancée de l'applique sur le mur. Un style contemporain et épuré qui trouve sa place dans un couloir, une entrée, un escalier ou un salon.",
            ar: "تركيبة عمودية بخطوط هندسية: قاعدة مربّعة سوداء ينطلق منها قضيبان أسودان متعاكسان يحيطان بأنبوب مضيء أبيض. تنساب الإضاءة الدافئة نحو الأعلى والأسفل فتُبرز القامة الممشوقة للقطعة على الجدار. أسلوب عصري بسيط يجد مكانه في الممر أو المدخل أو الدرج أو الصالون.",
            en: "A graphic vertical composition: a black square block from which two offset black rods extend, framing a white luminous tube. Warm light flows upwards and downwards, highlighting the fixture's slender silhouette on the wall. A clean, contemporary style that fits a hallway, entrance, staircase or living room."
        }
    },
    {
        id: 5, cat: "classique", spec: "int", price: "3 800 DA",
        images: ["Products/661861904_964582506531966_2113192358026335988_n.jpg"],
        name: { fr: "Applique Bras Dore", ar: "أبليك ذراع ذهبي", en: "Golden Arm Sconce" },
        desc: {
            fr: "Une longue barre lumineuse horizontale en finition dorée, portée par deux bras courbes fixés sur une platine rectangulaire assortie. Sa lumière diffuse et homogène éclaire sur toute la longueur, ce qui la rend idéale au-dessus d'un miroir, d'un tableau ou d'une console. Une silhouette élégante pour une entrée, un salon, une chambre ou un couloir.",
            ar: "قضيب ضوئي أفقي طويل بلمسة ذهبية، يحمله ذراعان منحنيان مثبّتان على قاعدة مستطيلة من اللون نفسه. يوزّع إضاءة ناعمة ومتجانسة على طوله كله، فيناسب أعلى المرآة أو اللوحة أو طاولة الكونسول. تصميم أنيق يليق بالمدخل والصالون وغرفة النوم والممر.",
            en: "A long horizontal light bar in a golden finish, held by two curved arms mounted on a matching rectangular back plate. It gives an even, diffused light along its whole length, making it well suited above a mirror, a painting or a console table. An elegant silhouette for an entrance, living room, bedroom or hallway."
        }
    },
    {
        id: 6, cat: "artistique", spec: "int", price: "5 500 DA",
        images: ["Products/662009863_964581446532072_569192811422730417_n.jpg"],
        name: { fr: "Applique Main Noire Globe", ar: "أبليك يد سوداء", en: "Black Hand Globe Sconce" },
        desc: {
            fr: "Une main sculptée noire, paume tournée vers le haut, qui semble tenir délicatement un globe blanc laiteux. Allumé, le globe diffuse une lumière douce et enveloppante, comme une petite lune posée au creux de la main. Une pièce artistique qui attire le regard dans un salon, une entrée ou une chambre.",
            ar: "يد منحوتة باللون الأسود، راحتها مفتوحة نحو الأعلى وكأنها تحمل برفق كرة بيضاء حليبية. عند إضاءتها تنشر الكرة ضوءًا ناعمًا يغمر المكان، كقمر صغير يستقرّ في كفّ اليد. قطعة فنية تلفت الأنظار في الصالون أو المدخل أو غرفة النوم.",
            en: "A sculpted black hand, palm turned upwards, gently cradling a milky white globe. When lit, the globe gives off a soft, enveloping glow, like a small moon resting in the palm. An artistic piece that draws the eye in a living room, entrance or bedroom."
        }
    },
    {
        id: 7, cat: "artistique", spec: "int", price: "6 000 DA", badge: "bestseller",
        images: ["Products/662135107_964581366532080_4597379214441569486_n.jpg"],
        name: { fr: "Applique Main Doree Globe", ar: "أبليك يد ذهبية", en: "Golden Hand Globe Sconce" },
        desc: {
            fr: "Une main à finition dorée brillante, doigts ouverts vers le haut, qui présente un globe blanc laiteux comme un bijou. Les reflets miroir du doré contrastent joliment avec la lumière douce du globe allumé. Une applique artistique et audacieuse pour donner du caractère à un salon, une entrée ou un couloir.",
            ar: "يد بلمسة ذهبية لامعة، أصابعها مفتوحة نحو الأعلى، تقدّم كرة بيضاء حليبية كأنها جوهرة. تتناغم انعكاسات الذهبي البرّاقة مع الضوء الناعم المنبعث من الكرة. إضاءة جدارية فنية جريئة تمنح الصالون أو المدخل أو الممر طابعًا مميّزًا.",
            en: "A hand in a shiny gold finish, fingers open upwards, presenting a milky white globe like a jewel. The mirror-like gold reflections contrast beautifully with the soft light of the lit globe. A bold, artistic sconce that gives character to a living room, entrance or hallway."
        }
    },
    {
        id: 8, cat: "decorative", spec: "int", price: "5 800 DA",
        images: ["Products/662188343_964582196531997_3727780789698678371_n.jpg"],
        name: { fr: "Applique Cristal Ruban Or", ar: "أبليك كريستال شريط ذهبي", en: "Gold Ribbon Crystal Sconce" },
        desc: {
            fr: "Un ruban à finition dorée brillante qui s'enroule en spirale autour d'une platine verticale, avec une bande lumineuse continue sur sa face intérieure. Allumée, la spirale dessine une ligne de lumière douce et fluide, que le doré reflète tout du long. Une pièce décorative pleine de mouvement pour un salon, une entrée, un escalier ou une chambre.",
            ar: "شريط بلمسة ذهبية لامعة يلتفّ حلزونيًا حول قاعدة عمودية، ويمتدّ على وجهه الداخلي خط ضوئي متّصل. عند تشغيلها يرسم الحلزون خطًا من الضوء الناعم المتدفّق تعكسه اللمسة الذهبية على طوله. قطعة ديكور مفعمة بالحركة تناسب الصالون أو المدخل أو الدرج أو غرفة النوم.",
            en: "A ribbon in a shiny gold finish spirals around a vertical back plate, with a continuous strip of light along its inner face. When lit, the spiral traces a soft, flowing line of light, echoed all along by the gold reflections. A decorative piece full of movement for a living room, entrance, staircase or bedroom."
        }
    },
    {
        id: 9, cat: "led", spec: "both", price: "4 800 DA",
        images: ["Products/662189938_964582956531921_6168745706088512068_n.jpg"],
        name: { fr: "Applique LED Geometrique Losange", ar: "أبليك LED معيني", en: "LED Diamond Geometric Sconce" },
        desc: {
            fr: "Un panneau transparent gravé de contours en forme de diamant, orné d'un fin motif de points et d'une barre centrale à finition dorée. La lumière chaude s'échappe vers le haut et vers le bas et projette sur le mur de grands faisceaux en losanges, pour un effet graphique saisissant. À installer dans un salon, un couloir ou un escalier, mais aussi à l'extérieur pour mettre en valeur une façade ou une entrée.",
            ar: "لوح شفّاف محفور بخطوط على شكل ماسة، تزيّنه نقاط دقيقة ويتوسّطه قضيب بلمسة ذهبية. تنبعث الإضاءة الدافئة نحو الأعلى والأسفل فترسم على الجدار حُزمًا ضوئية واسعة على شكل معيّنات، في تأثير هندسي لافت. تناسب الصالون والممر والدرج، كما يمكن تركيبها في الخارج لإبراز الواجهة أو المدخل.",
            en: "A transparent panel engraved with diamond-shaped outlines, decorated with a fine dotted pattern and a central bar in a golden finish. Warm light escapes upwards and downwards, projecting large diamond-shaped beams onto the wall for a striking graphic effect. Install it in a living room, hallway or staircase, or outdoors to highlight a façade or entrance."
        }
    },
    {
        id: 10, cat: "led", spec: "int", price: "4 200 DA",
        images: ["Products/662235734_964582336531983_6618653074204394511_n.jpg"],
        name: { fr: "Applique LED Cristal Cylindre", ar: "أبليك LED كريستال أسطواني", en: "LED Crystal Cylinder Sconce" },
        desc: {
            fr: "Une applique de chevet noir mat qui réunit deux éclairages : en haut, un disque lumineux diffuse une lumière chaude et enveloppante ; en bas, un spot de lecture cylindrique incliné concentre la lumière là où l'on en a besoin. Deux petits interrupteurs sont intégrés à la platine. Idéale en tête de lit dans une chambre, ou pour un coin lecture dans le salon.",
            ar: "إضاءة جدارية لجانب السرير بلون أسود مطفأ تجمع بين إنارتين: في الأعلى قرص مضيء ينشر ضوءًا دافئًا ناعمًا، وفي الأسفل كشّاف قراءة أسطواني مائل يركّز الضوء حيث تحتاجه. وقد زُوّدت القاعدة بمفتاحين صغيرين. مناسبة لرأس السرير في غرفة النوم أو لركن القراءة في الصالون.",
            en: "A matte black bedside sconce combining two lights: at the top, a luminous disc gives off a warm, enveloping glow; below, an angled cylindrical reading spot focuses light right where you need it. Two small switches are built into the back plate. Well suited to the head of the bed in a bedroom, or to a reading corner in the living room."
        }
    },
    {
        id: 11, cat: "classique", spec: "int", price: "4 000 DA",
        images: ["Products/662355147_964583289865221_8593786777519565021_n.jpg"],
        name: { fr: "Applique Classique Laiton", ar: "أبليك نحاسي كلاسيكي", en: "Classic Brass Sconce" },
        desc: {
            fr: "Un anneau lumineux au dessin épuré : la moitié haute diffuse une lumière blanche et uniforme, la moitié basse arbore une finition dorée qui rejoint une platine rectangulaire assortie. Sur cette platine, un petit panneau de commande porte des boutons marche/arrêt, + et −. Une applique moderne qui trouve naturellement sa place dans un salon, une chambre ou un couloir.",
            ar: "حلقة مضيئة بتصميم بسيط وأنيق: نصفها العلوي يبعث ضوءًا أبيض متجانسًا، ونصفها السفلي بلمسة ذهبية يتصل بقاعدة مستطيلة من اللون نفسه. تضمّ القاعدة لوحة تحكم صغيرة بأزرار للتشغيل والإطفاء و«+» و«−». قطعة عصرية تنسجم بسهولة مع الصالون أو غرفة النوم أو الممر.",
            en: "A clean-lined ring of light: the upper half gives off an even white glow, while the lower half has a gold finish that meets a matching rectangular wall plate. The plate carries a small control panel with on/off, + and − buttons. A modern sconce that sits naturally in a living room, bedroom or hallway."
        }
    },
    {
        id: 12, cat: "decorative", spec: "int", price: "6 500 DA", badge: "premium",
        images: ["Products/662375647_964581536532063_4214740935727736516_n.jpg"],
        name: { fr: "Applique Cristal Spirale Or", ar: "أبليك كريستال حلزوني ذهبي", en: "Gold Spiral Crystal Sconce" },
        desc: {
            fr: "Une main sculptée à la finition dorée brillante, doigts ouverts, qui tient délicatement un globe blanc laiteux. Allumé, le globe diffuse une lumière douce tandis que les reflets de la main animent le mur. Une pièce artistique qui attire le regard dans une entrée, un salon ou un couloir.",
            ar: "يد منحوتة بلمسة ذهبية لامعة، أصابعها مفتوحة تحتضن برفق كرة بيضاء حليبية اللون. عند الإضاءة تنشر الكرة نورًا هادئًا، فيما تضفي انعكاسات اليد الذهبية حيوية على الجدار. قطعة فنية تلفت الأنظار في المدخل أو الصالون أو الممر.",
            en: "A sculpted hand with a glossy gold finish, fingers open, gently cradling a milky-white globe. When lit, the globe gives off a soft glow while the reflections on the hand bring the wall to life. An artistic piece that draws the eye in an entryway, living room or hallway."
        }
    },
    {
        id: 13, cat: "classique", spec: "int", price: "3 500 DA",
        images: ["Products/662877554_964582669865283_8855418817131032716_n.jpg"],
        name: { fr: "Applique Murale Boule Argent", ar: "أبليك كرة فضية", en: "Silver Globe Wall Sconce" },
        desc: {
            fr: "Une applique à la silhouette galbée, resserrée en son centre comme un sablier, présentée ici en finition dorée et en noir. Elle projette la lumière vers le haut et vers le bas, dessinant sur le mur deux faisceaux chaleureux aux contours nets. Elle rythme joliment un couloir ou une cage d'escalier, et encadre avec élégance une tête de lit dans une chambre.",
            ar: "إضاءة جدارية بقوام منحنٍ يضيق في وسطه كالساعة الرملية، معروضة هنا بلونين: الذهبي والأسود. توجّه الضوء نحو الأعلى والأسفل، فترسم على الجدار حزمتين دافئتين بحواف واضحة. تضفي إيقاعًا جميلًا على الممر أو الدرج، وتحيط بسرير غرفة النوم بلمسة أنيقة.",
            en: "A sconce with a curved, hourglass silhouette that narrows at its centre, shown here in a gold finish and in black. It casts light both upward and downward, drawing two warm, crisp-edged beams on the wall. It adds rhythm to a hallway or staircase, and neatly frames a bed in the bedroom."
        }
    },
    {
        id: 14, cat: "led", spec: "int", price: "3 800 DA",
        images: ["Products/662933092_964583036531913_5430809172069410371_n.jpg"],
        name: { fr: "Applique LED Barre Noire", ar: "أبليك LED شريط أسود", en: "Black LED Bar Sconce" },
        desc: {
            fr: "Cinq tubes noirs de longueurs différentes, montés en décalé sur une barre horizontale, chacun terminé à ses deux extrémités par un embout lumineux. L'ensemble forme une composition graphique ponctuée de points de lumière blanche, avec un léger halo sur le mur. Sur la photo, la version noire est présentée à côté de sa déclinaison dorée ; elle convient à un salon, une entrée ou un couloir au style contemporain.",
            ar: "خمسة أنابيب سوداء بأطوال متفاوتة، مثبتة بشكل متدرّج على قاعدة أفقية، ولكل أنبوب طرفان مضيئان. تشكّل معًا تكوينًا هندسيًا لافتًا تتخلله نقاط من الضوء الأبيض، مع هالة خفيفة على الجدار. تظهر النسخة السوداء في الصورة إلى جانب نسختها الذهبية، وتناسب الصالون أو المدخل أو الممر ذا الطابع العصري.",
            en: "Five black tubes of different lengths, set in a staggered arrangement on a horizontal bar, each finished with a glowing tip at both ends. Together they create a graphic composition dotted with points of white light and a soft halo on the wall. The photo shows the black version next to its gold counterpart; it suits a contemporary living room, entryway or hallway."
        }
    },
    {
        id: 15, cat: "led", spec: "int", price: "4 000 DA",
        images: ["Products/663072230_964583076531909_5454792028482091568_n.jpg"],
        name: { fr: "Applique LED Double Barre", ar: "أبليك LED شريط مزدوج", en: "Double LED Bar Sconce" },
        desc: {
            fr: "Cinq tubes à la finition dorée, de hauteurs différentes, fixés en décalé sur une barre horizontale assortie. Chaque tube s'illumine à ses deux extrémités, ce qui crée un jeu de points lumineux vers le haut et vers le bas et un halo doux sur le mur. Une applique élégante et graphique pour un salon, une entrée ou le long d'un couloir.",
            ar: "خمسة أنابيب بلمسة ذهبية وبارتفاعات مختلفة، مثبتة بشكل متدرّج على قاعدة أفقية من اللون نفسه. يضيء كل أنبوب من طرفيه، فتتوزع نقاط الضوء نحو الأعلى والأسفل مع هالة ناعمة على الجدار. إضاءة جدارية أنيقة بطابع هندسي تناسب الصالون أو المدخل أو الممر.",
            en: "Five gold-finish tubes of varying heights, mounted in a staggered arrangement on a matching horizontal bar. Each tube lights up at both ends, creating a play of light points above and below and a soft halo on the wall. An elegant, graphic sconce for a living room, an entryway or along a hallway."
        }
    },
    {
        id: 16, cat: "led", spec: "both", price: "3 600 DA",
        images: ["Products/663242075_964583206531896_7729218085022407988_n.jpg"],
        name: { fr: "Applique LED Rectangulaire", ar: "أبليك LED مستطيل", en: "Rectangular LED Sconce" },
        desc: {
            fr: "Une applique à la finition noire composée de cinq tubes de longueurs variées, montés en décalé sur une barre horizontale. Leurs extrémités lumineuses, en haut comme en bas, dessinent une silhouette verticale rythmée qui se détache nettement sur un mur clair. Un choix contemporain pour un salon, une entrée, un couloir ou une cage d'escalier.",
            ar: "إضاءة جدارية سوداء تتكوّن من خمسة أنابيب بأطوال متنوعة، مثبتة بشكل متدرّج على قاعدة أفقية. أطرافها المضيئة في الأعلى والأسفل ترسم شكلًا عموديًا متناسقًا يبرز بوضوح على الجدران الفاتحة. خيار عصري للصالون أو المدخل أو الممر أو الدرج.",
            en: "A black-finish sconce made of five tubes of varying lengths, mounted in a staggered arrangement on a horizontal bar. Their glowing tips, top and bottom, trace a rhythmic vertical silhouette that stands out clearly against a light wall. A contemporary choice for a living room, entryway, hallway or staircase."
        }
    },
    {
        id: 17, cat: "artistique", spec: "int", price: "5 500 DA",
        images: ["Products/663284683_964581506532066_7208053677261643621_n.jpg"],
        name: { fr: "Applique Main Noire Paume", ar: "أبليك يد سوداء مفتوحة", en: "Black Palm Hand Sconce" },
        desc: {
            fr: "Une main sculptée à la finition noire mate, doigts délicatement ouverts, qui tient un globe blanc laiteux. Le contraste entre le noir profond et la douceur du globe donne à cette applique un caractère artistique affirmé. Elle apporte une touche originale à une entrée, un salon, un couloir ou une chambre.",
            ar: "يد منحوتة بلمسة سوداء غير لامعة، أصابعها مفتوحة برقّة وتحمل كرة بيضاء حليبية. يمنح التباين بين السواد العميق ونعومة الكرة البيضاء هذه الإضاءة طابعًا فنيًا مميزًا. تضيف لمسة مبتكرة إلى المدخل أو الصالون أو الممر أو غرفة النوم.",
            en: "A sculpted hand in a matte black finish, fingers gently spread, holding a milky-white globe. The contrast between the deep black and the softness of the globe gives this sconce a distinctly artistic character. It brings an original touch to an entryway, living room, hallway or bedroom."
        }
    },
    {
        id: 18, cat: "decorative", spec: "int", price: "5 200 DA",
        images: ["Products/663322400_964583399865210_259164777113537625_n.jpg"],
        name: { fr: "Applique Plume Or LED", ar: "أبليك ريشة ذهبية LED", en: "Gold Feather LED Sconce" },
        desc: {
            fr: "Tel un collier de perles, cette applique porte une rangée de globes blancs lumineux, séparés par de petites perles dorées et suspendus à deux fines tiges reliées à une platine ronde à la finition dorée. Les globes diffusent une lumière blanche douce et régulière. La photo montre aussi une version noire ; une pièce décorative qui habille un mur de salon, de chambre ou d'entrée.",
            ar: "على هيئة عقد من اللؤلؤ، تحمل هذه الإضاءة الجدارية سلسلة من الكرات البيضاء المضيئة تفصل بينها حبات ذهبية صغيرة، معلّقة بقضيبين رفيعين يتصلان بقاعدة دائرية بلمسة ذهبية. تنشر الكرات ضوءًا أبيض ناعمًا ومتجانسًا. تُظهر الصورة أيضًا نسخة سوداء، وهي قطعة ديكور تزيّن جدار الصالون أو غرفة النوم أو المدخل.",
            en: "Like a pearl necklace, this sconce carries a string of glowing white globes, separated by small gold beads and hung from two slender rods attached to a round gold-finish wall plate. The globes give off a soft, even white light. The photo also shows a black version; a decorative piece that dresses a living room, bedroom or entryway wall."
        }
    },
    {
        id: 19, cat: "led", spec: "both", price: "4 500 DA",
        images: ["Products/663373100_964582706531946_6564342833732177354_n.jpg"],
        name: { fr: "Applique LED Projection Ovale", ar: "أبليك LED إسقاط بيضاوي", en: "Oval LED Projection Sconce" },
        desc: {
            fr: "Une applique de forme ovale, centrée sur une barre à la finition dorée posée sur un fond texturé à motif pointillé, et soulignée de contours transparents qui s'illuminent. Elle projette sur le mur des faisceaux de lumière chaude en triangles, au-dessus et au-dessous, pour un effet graphique marqué. Elle met en valeur un salon, une entrée ou un couloir, et peut aussi animer une façade ou une entrée extérieure.",
            ar: "إضاءة جدارية بيضاوية الشكل، يتوسطها قضيب بلمسة ذهبية فوق خلفية منقّطة الملمس، وتحيط بها حواف شفافة تتوهّج بالضوء. تُسقط على الجدار حزمًا مثلثة من الضوء الدافئ نحو الأعلى والأسفل، فتخلق تأثيرًا هندسيًا لافتًا. تُبرز جمال الصالون أو المدخل أو الممر، ويمكنها أيضًا أن تضفي الحيوية على الواجهة أو المدخل الخارجي.",
            en: "An oval sconce centred on a gold-finish bar set against a textured, dotted background, outlined by transparent contours that light up. It projects triangular beams of warm light onto the wall, above and below, for a bold graphic effect. It enhances a living room, entryway or hallway, and can also bring a façade or outdoor entrance to life."
        }
    },
    {
        id: 20, cat: "classique", spec: "int", price: "Sur demande",
        images: ["Products/665839134_964580653198818_329008676099722200_n.jpg"],
        name: { fr: "Collection Showroom ASY", ar: "مجموعة المعرض ASY", en: "ASY Showroom Collection" },
        desc: {
            fr: "Cette photo offre un aperçu de la collection exposée dans notre showroom ASY Store à Alger : appliques à abat-jour clairs ou foncés sur tiges fines en finitions dorée, argentée ou noire, anneaux lumineux, compositions de tubes lumineux et modèles aux courbes de lumière. Plusieurs modèles y sont présentés en différentes finitions, pour vous aider à choisir celle qui s'accorde avec votre intérieur. Écrivez-nous sur WhatsApp pour connaître les modèles disponibles et leurs prix.",
            ar: "تقدّم هذه الصورة لمحة عن التشكيلة المعروضة في صالة عرض ASY Store بالجزائر العاصمة: إضاءات جدارية بأغطية فاتحة أو داكنة على قضبان رفيعة بلمسات ذهبية وفضية وسوداء، وحلقات مضيئة، وتكوينات من الأنابيب المضيئة، وتصاميم بخطوط ضوئية منحنية. تُعرض عدة موديلات بتشطيبات مختلفة لتساعدكم على اختيار ما يناسب ديكور منزلكم. راسلونا عبر واتساب لمعرفة الموديلات المتوفرة وأسعارها.",
            en: "This photo gives a glimpse of the collection on display in our ASY Store showroom in Algiers: sconces with light or dark shades on slender stems in gold, silver or black finishes, glowing rings, clusters of light tubes and designs with curving lines of light. Several models are shown in different finishes to help you find the one that suits your home. Message us on WhatsApp to find out which models are available and their prices."
        }
    },
    {
        id: 21, cat: "led", spec: "int", price: "4 800 DA",
        images: ["Products/666111635_964581426532074_2743584886324193133_n.jpg"],
        name: { fr: "Applique LED Anneau Noir", ar: "أبليك LED حلقة سوداء", en: "Black Ring LED Sconce" },
        desc: {
            fr: "Une main sculptée à la finition noire mate sort du mur et soutient délicatement un globe blanc opalin. Allumé, le globe diffuse une lumière douce et enveloppante, tandis que la silhouette de la main apporte une touche artistique singulière. Une belle façon de donner du caractère à un salon, une entrée ou un couloir.",
            ar: "يدٌ منحوتة بلون أسود غير لامع تمتدّ من الجدار لتحمل برفقٍ كرةً بيضاء حليبية. عند الإضاءة تنشر الكرة نورًا ناعمًا يغمر المكان، فيما يضفي شكل اليد لمسة فنية لافتة. خيار جميل لإضفاء طابع شخصي على الصالون أو المدخل أو الرواق.",
            en: "A sculpted hand in a matte black finish reaches out from the wall, gently holding an opal white globe. When lit, the globe gives off a soft, enveloping glow, while the silhouette of the hand adds a distinctive artistic touch. A lovely way to bring character to a living room, entryway or hallway."
        }
    },
    {
        id: 22, cat: "artistique", spec: "int", price: "4 200 DA",
        images: ["Products/666183535_964582429865307_3599050698505953145_n.jpg"],
        name: { fr: "Applique Boule Doree Murale", ar: "أبليك كرة ذهبية", en: "Golden Globe Wall Sconce" },
        desc: {
            fr: "Applique au design contemporain à finition noire : une platine verticale porte en partie haute un disque lumineux qui diffuse une lumière blanche vers le haut et vers le bas du mur, et plus bas un bras cylindrique terminé par un petit spot de lecture. Deux interrupteurs sont intégrés directement à la platine. Parfaite en tête de lit dans une chambre, ou près d'un fauteuil de lecture au salon.",
            ar: "مصباح جداري بتصميم عصري ولون أسود: لوحة عمودية تحمل في أعلاها قرصًا مضيئًا ينشر ضوءًا أبيض نحو أعلى الجدار وأسفله، وفي أسفلها ذراعٌ أسطوانية تنتهي ببقعة ضوء صغيرة مخصّصة للقراءة. وقد زُوّدت اللوحة بمفتاحَي تشغيل مدمجين. مناسب جدًا بجانب السرير في غرفة النوم، أو قرب كرسي القراءة في الصالون.",
            en: "A contemporary wall light in a black finish: a slim vertical plate holds a glowing disc at the top that casts white light up and down the wall, and below it a cylindrical arm ending in a small reading spot. Two switches are built right into the plate. Ideal at the head of the bed in a bedroom, or beside a reading chair in the living room."
        }
    },
    {
        id: 23, cat: "classique", spec: "int", price: "4 500 DA",
        images: ["Products/666489794_964573399866210_8420417276701669506_n.jpg"],
        name: { fr: "Applique Eclairage Tableau Or", ar: "أبليك إضاءة لوحة ذهبي", en: "Gold Picture Light Sconce" },
        desc: {
            fr: "Une applique pour tableau à la finition dorée : une longue réglette fine, dotée d'un diffuseur blanc sur toute sa longueur, s'avance au-dessus du cadre grâce à deux bras incurvés. Pensée pour mettre en valeur un tableau, un miroir ou une photo encadrée, elle apporte une note élégante à votre mur. Elle trouve sa place au salon, dans un couloir ou dans une entrée.",
            ar: "مصباح جداري مخصّص لإنارة اللوحات بلمسة ذهبية: شريط طويل ورفيع بغطاء أبيض على امتداده، يمتدّ فوق الإطار بواسطة ذراعين مقوّستين. صُمّم ليُبرز لوحاتكم أو مراياكم أو صوركم المؤطّرة ويمنح الجدار حضورًا أنيقًا. يليق بالصالون والرواق والمدخل.",
            en: "A picture light in a golden finish: a long, slim bar with a white diffuser along its length reaches over the frame on two curved arms. Designed to showcase a painting, mirror or framed photo, it gives your wall an elegant finishing touch. At home in a living room, hallway or entryway."
        }
    },
    {
        id: 24, cat: "led", spec: "int", price: "5 200 DA", badge: "new",
        images: ["Products/666526631_964580673198816_6688133335723400980_n.jpg"],
        name: { fr: "Applique LED Anneau Tactile", ar: "أبليك LED حلقة باللمس", en: "Touch Ring LED Sconce" },
        desc: {
            fr: "Un diffuseur transparent, parsemé de fines bulles, s'enroule en torsade au-dessus et au-dessous d'une bague centrale à finition dorée finement striée. Allumée, l'applique fait scintiller ces petites bulles et souligne ses contours d'un liseré lumineux, pour une ambiance raffinée. Elle trouve naturellement sa place dans un salon, une chambre ou le long d'un escalier.",
            ar: "غطاء شفاف مرصّع بفقاعات دقيقة يلتفّ بشكل حلزوني فوق حلقة مركزية ذهبية اللون ذات خطوط ناعمة وتحتها. عند الإضاءة تتلألأ هذه الفقاعات وتتوهّج حوافّ الغطاء بخطّ رفيع من النور، فتضفي على المكان أجواءً راقية. يجد مكانه بسهولة في الصالون أو غرفة النوم أو على امتداد الدرج.",
            en: "A clear shade dotted with fine bubbles twists above and below a central band in a finely ribbed golden finish. When lit, the bubbles sparkle and the edges glow with a fine line of light, creating a refined atmosphere. It fits naturally in a living room, bedroom or along a staircase."
        }
    },
    {
        id: 25, cat: "decorative", spec: "int", price: "6 200 DA", badge: "premium",
        images: ["Products/666624621_964581953198688_5833031665386046773_n.jpg"],
        name: { fr: "Applique Cristal Torsade Or", ar: "أبليك كريستال ملتوي ذهبي", en: "Gold Twist Crystal Sconce" },
        desc: {
            fr: "Deux mains sculptées à la finition dorée brillante, aux reflets miroir, recueillent un globe blanc opalin comme un trésor. Le globe diffuse une lumière douce et apaisante, tandis que la surface dorée capte et renvoie la lumière autour d'elle. Une pièce décorative affirmée, qui crée un vrai point focal dans un salon, une entrée ou un couloir.",
            ar: "يدان منحوتتان بلون ذهبي لامع كالمرآة تحتضنان كرةً بيضاء حليبية كأنها كنز ثمين. تنشر الكرة ضوءًا ناعمًا وهادئًا، بينما يعكس السطح الذهبي بريق النور من حولها. قطعة ديكور جريئة تمنح الصالون أو المدخل أو الرواق نقطة جذب حقيقية.",
            en: "Two sculpted hands in a glossy, mirror-like golden finish cradle an opal white globe like a treasure. The globe gives off a soft, soothing glow, while the golden surface catches and reflects the light around it. A bold decorative piece that creates a real focal point in a living room, entryway or hallway."
        }
    },
    {
        id: 26, cat: "led", spec: "both", price: "5 000 DA",
        images: ["Products/666677715_964574586532758_2147664094945029877_n.jpg"],
        name: { fr: "Applique LED Trio Geometrique", ar: "أبليك LED ثلاثي هندسي", en: "Geometric Trio LED Sconce" },
        desc: {
            fr: "Un panneau transparent finement gravé, traversé en son centre par une barre à finition dorée, projette sur le mur des faisceaux de lumière chaude vers le haut et vers le bas, qui dessinent de véritables motifs géométriques. La photo présente trois découpes : pointes en zigzag, vagues et ovale arrondi. À l'intérieur, elle anime un salon, un couloir ou une cage d'escalier ; à l'extérieur, elle met en valeur une entrée ou une façade.",
            ar: "لوحة شفافة بنقوش دقيقة يتوسّطها قضيبٌ ذهبي اللون، ترسم على الجدار حزمًا من الضوء الدافئ نحو الأعلى والأسفل على شكل زخارف هندسية لافتة. تعرض الصورة ثلاثة تصاميم: حوافّ متعرّجة، وتموّجات، وشكل بيضاوي. في الداخل تبعث الحيوية في الصالون أو الرواق أو الدرج، وفي الخارج تُبرز المدخل أو واجهة المنزل.",
            en: "A finely etched clear panel, crossed at its centre by a bar in a golden finish, casts beams of warm light up and down the wall, drawing striking geometric patterns. The photo shows three cut-out shapes: zigzag points, waves and a rounded oval. Indoors it brings a living room, hallway or stairwell to life; outdoors it highlights an entrance or façade."
        }
    },
    {
        id: 27, cat: "decorative", spec: "int", price: "3 800 DA",
        images: ["Products/666834022_964582249865325_345763148090551886_n.jpg"],
        name: { fr: "Applique Demi-Lune Doree", ar: "أبليك نصف قمر ذهبي", en: "Golden Half-Moon Sconce" },
        desc: {
            fr: "Applique de lecture à la finition noire : une platine verticale surmontée d'un disque lumineux à la lueur chaude et dorée, complétée par un bras cylindrique qui se termine par un petit spot. Deux interrupteurs discrets sont intégrés à la platine. Une ambiance douce et cosy, idéale en tête de lit dans une chambre ou à côté d'un canapé pour lire au salon.",
            ar: "مصباح جداري للقراءة باللون الأسود: لوحة عمودية يعلوها قرص مضيء بضوء دافئ يميل إلى الذهبي، وتكمّلها ذراع أسطوانية تنتهي ببقعة ضوء صغيرة. وقد دُمج في اللوحة مفتاحا تشغيل بشكل أنيق. يمنح أجواءً هادئة ودافئة، وهو مثالي بجانب السرير في غرفة النوم أو قرب الأريكة للقراءة في الصالون.",
            en: "A reading wall light in a black finish: a vertical plate topped with a glowing disc that gives off a warm, golden light, paired with a cylindrical arm ending in a small spotlight. Two discreet switches are built into the plate. It creates a soft, cosy mood, perfect at the head of the bed or beside the sofa for reading in the living room."
        }
    },
    {
        id: 28, cat: "led", spec: "int", price: "4 800 DA",
        images: ["Products/666984601_964573919866158_5786421101155669582_n.jpg"],
        name: { fr: "Applique Lineaire Or Noir", ar: "أبليك خطي ذهبي وأسود", en: "Gold & Black Linear Sconce" },
        desc: {
            fr: "Deux fines tiges à la finition dorée encadrent une barre lumineuse blanche, le tout réuni au centre par un bloc carré noir. La lumière chaude se diffuse le long de la barre et dessine un halo doux sur le mur. Une ligne verticale élégante qui habille une tête de lit, un salon ou un couloir.",
            ar: "قضيبان رفيعان بلون ذهبي يحيطان بشريط مضيء أبيض، تجمعها في الوسط كتلة سوداء مربّعة. ينساب الضوء الدافئ على طول الشريط ليرسم هالة ناعمة على الجدار. خطّ عمودي أنيق يزيّن رأس السرير أو الصالون أو الرواق.",
            en: "Two slim rods in a golden finish frame a white light bar, joined at the centre by a square black block. Warm light spreads along the bar and draws a soft halo on the wall. An elegant vertical line that dresses up a bedhead, living room or hallway."
        }
    },
    {
        id: 29, cat: "led", spec: "ext", price: "5 500 DA",
        images: ["Products/667730572_964574116532805_2471196322789748512_n.jpg"],
        name: { fr: "Applique Exterieur Moderne", ar: "أبليك خارجي عصري", en: "Modern Outdoor Sconce" },
        desc: {
            fr: "Applique d'extérieur aux lignes architecturales, à la finition gris foncé : un socle carré prolongé par une colonne à gradins, coiffée d'une tête plate et large dont le diffuseur répand une lumière chaude sur le mur. Elle souligne joliment une porte d'entrée ou une façade, et accueille vos invités dès la tombée de la nuit.",
            ar: "مصباح جداري خارجي بخطوط معمارية ولون رمادي داكن: قاعدة مربّعة يعلوها عمود متدرّج ينتهي برأس مسطّح عريض ينشر ضوءًا دافئًا على الجدار. يُبرز بأناقة باب المدخل أو واجهة المنزل، ويستقبل ضيوفكم مع حلول المساء.",
            en: "An outdoor wall light with architectural lines in a dark grey finish: a square base rises into a stepped column topped by a wide, flat head that spreads warm light across the wall. It neatly highlights a front door or façade and welcomes your guests as night falls."
        }
    },
    {
        id: 30, cat: "decorative", spec: "int", price: "7 500 DA", badge: "new",
        images: ["Products/668121146_964573326532884_1466832074354701932_n.jpg"],
        name: { fr: "Applique Plume Triple LED", ar: "أبليك ريش ثلاثي LED", en: "Triple Feather LED Sconce" },
        desc: {
            fr: "Trois plumes sculptées aux barbes finement ciselées, chacune traversée d'une nervure contrastée : noire à nervure dorée, dorée à nervure noire, blanche à nervure dorée. Rétroéclairées, elles se détachent du mur grâce à un halo de lumière chaude qui révèle leur relief. Une touche poétique pour un salon, une chambre ou une montée d'escalier.",
            ar: "ثلاث ريشات منحوتة بتفاصيل دقيقة، يتوسّط كلًّا منها ساقٌ بلون مغاير: سوداء بساق ذهبية، وذهبية بساق سوداء، وبيضاء بساق ذهبية. بفضل الإضاءة الخلفية تبرز الريشات عن الجدار محاطةً بهالة من الضوء الدافئ تكشف عن نقوشها. لمسة شاعرية تزيّن الصالون أو غرفة النوم أو جدار الدرج.",
            en: "Three sculpted feathers with finely detailed barbs, each crossed by a contrasting quill: black with gold, gold with black, and white with gold. Backlit, they seem to float off the wall, framed by a warm halo that brings out their texture. A poetic touch for a living room, bedroom or staircase wall."
        }
    }
];
