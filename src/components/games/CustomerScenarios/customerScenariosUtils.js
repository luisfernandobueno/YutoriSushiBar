
export const LANGUAGES = {
  es: "Español",
  en: "English",
  it: "Italiano",
  pt: "Português",
};

// Randomly shuffles an array without modifying the original.
export function shuffleArray(array) {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

export const SCENARIOS = [
  {
    id: 1,
    category: "Greeting",
    difficulty: "easy",
    translations: {
      es: {
        title: "Recibir a los clientes",
        situation:
          "Una pareja entra al restaurante. Se sientan en una mesa y todavía no han recibido atención. ¿Qué haces?",
        options: [
          "Te acercas con una sonrisa y les das la bienvenida.",
          "Esperas a que te llamen.",
          "Les preguntas inmediatamente qué quieren comer.",
          "Les dejas el menú en la mesa sin decir nada.",
        ],
        explanation:
          "Una bienvenida amable genera una buena primera impresión. Acércate, saluda y dales tiempo para mirar el menú.",
        category: "Bienvenida",
      },
      en: {
        title: "Welcoming customers",
        situation:
          "A couple enters the restaurant and sits at a table. Nobody has attended to them yet. What do you do?",
        options: [
          "Approach them with a smile and welcome them.",
          "Wait until they call you.",
          "Immediately ask what they want to eat.",
          "Leave the menus on the table without saying anything.",
        ],
        explanation:
          "A friendly welcome creates a good first impression. Greet them and give them some time to look at the menu.",
        category: "Greeting",
      },
      it: {
        title: "Accogliere i clienti",
        situation:
          "Una coppia entra nel ristorante e si siede a un tavolo. Nessuno li ha ancora serviti. Cosa fai?",
        options: [
          "Ti avvicini sorridendo e dai loro il benvenuto.",
          "Aspetti che ti chiamino.",
          "Chiedi subito cosa vogliono mangiare.",
          "Lasci i menu sul tavolo senza dire nulla.",
        ],
        explanation:
          "Un'accoglienza cordiale crea una buona prima impressione. Saluta i clienti e lascia loro il tempo di consultare il menu.",
        category: "Accoglienza",
      },
      pt: {
        title: "Receber os clientes",
        situation:
          "Um casal entra no restaurante e se senta à mesa. Ainda ninguém os atendeu. O que você faz?",
        options: [
          "Você se aproxima com um sorriso e dá as boas-vindas.",
          "Espera até que chamem você.",
          "Pergunta imediatamente o que querem comer.",
          "Deixa os cardápios na mesa sem dizer nada.",
        ],
        explanation:
          "Uma recepção simpática cria uma boa primeira impressão. Cumprimente os clientes e dê tempo para que consultem o cardápio.",
        category: "Recepção",
      },
    },
    correct: 0,
  },
  {
    id: 2,
    category: "Menu knowledge",
    difficulty: "medium",
    translations: {
      es: {
        title: "Explicar un plato",
        situation:
          "Un cliente señala un plato del menú y pregunta: «¿Qué trae esto?». No recuerdas todos sus ingredientes. ¿Cómo respondes?",
        options: [
          "Inventas una descripción para no parecer inseguro.",
          "Le dices que no sabes y te vas.",
          "Le explicas lo que sabes y confirmas los ingredientes con cocina.",
          "Le recomiendas otro plato sin responder.",
        ],
        explanation:
          "Es mejor ser honesto. Puedes decir: «Te confirmo bien los ingredientes para darte la información correcta». Nunca inventes información sobre un plato.",
        category: "Conocimiento del menú",
      },
      en: {
        title: "Explaining a dish",
        situation:
          "A customer points at a dish on the menu and asks, 'What's in this?'. You cannot remember all its ingredients. How do you respond?",
        options: [
          "Make up a description so you don't seem unsure.",
          "Say you don't know and walk away.",
          "Explain what you know and confirm the ingredients with the kitchen.",
          "Recommend another dish without answering.",
        ],
        explanation:
          "It's better to be honest. You can say, 'Let me double-check the ingredients so I can give you accurate information.' Never make up details about a dish.",
        category: "Menu knowledge",
      },
      it: {
        title: "Descrivere un piatto",
        situation:
          "Un cliente indica un piatto sul menu e chiede: «Cosa contiene?». Non ricordi tutti gli ingredienti. Come rispondi?",
        options: [
          "Inventi una descrizione per non sembrare insicuro.",
          "Dici che non lo sai e te ne vai.",
          "Spieghi ciò che sai e verifichi gli ingredienti con la cucina.",
          "Consigli un altro piatto senza rispondere.",
        ],
        explanation:
          "È meglio essere sinceri. Puoi dire: «Verifico gli ingredienti per darle un'informazione precisa». Non inventare mai dettagli su un piatto.",
        category: "Conoscenza del menu",
      },
      pt: {
        title: "Explicar um prato",
        situation:
          "Um cliente aponta para um prato no cardápio e pergunta: «O que vem nele?». Você não lembra de todos os ingredientes. Como responde?",
        options: [
          "Inventa uma descrição para não parecer inseguro.",
          "Diz que não sabe e vai embora.",
          "Explica o que sabe e confirma os ingredientes com a cozinha.",
          "Recomenda outro prato sem responder.",
        ],
        explanation:
          "É melhor ser sincero. Você pode dizer: «Vou confirmar os ingredientes para lhe passar a informação correta». Nunca invente detalhes sobre um prato.",
        category: "Conhecimento do cardápio",
      },
    },
    correct: 2,
  },
  {
    id: 3,
    category: "Recommendations",
    difficulty: "medium",
    translations: {
      es: {
        title: "Recomendar un plato",
        situation:
          "Un cliente te dice que es su primera vez en un sushi bar y no sabe qué pedir. ¿Qué haces?",
        options: [
          "Le recomiendas el plato más caro.",
          "Le preguntas qué sabores o ingredientes le gustan y le sugieres algunas opciones.",
          "Le dices que todos los platos son iguales.",
          "Eliges por él sin preguntarle nada.",
        ],
        explanation:
          "Primero descubre sus gustos y preferencias. Así puedes recomendar algo que realmente se adapte a lo que busca.",
        category: "Recomendaciones",
      },
      en: {
        title: "Making a recommendation",
        situation:
          "A customer tells you it's their first time at a sushi bar and they don't know what to order. What do you do?",
        options: [
          "Recommend the most expensive dish.",
          "Ask what flavors or ingredients they enjoy and suggest a few options.",
          "Tell them all the dishes are basically the same.",
          "Choose for them without asking anything.",
        ],
        explanation:
          "Find out what they enjoy first. This allows you to recommend something that genuinely suits their preferences.",
        category: "Recommendations",
      },
      it: {
        title: "Consigliare un piatto",
        situation:
          "Un cliente ti dice che è la sua prima volta in un sushi bar e non sa cosa ordinare. Cosa fai?",
        options: [
          "Consigli il piatto più costoso.",
          "Chiedi quali sapori o ingredienti preferisce e suggerisci alcune opzioni.",
          "Dici che tutti i piatti sono praticamente uguali.",
          "Scegli al posto suo senza chiedere nulla.",
        ],
        explanation:
          "Prima cerca di capire i suoi gusti. In questo modo puoi consigliare qualcosa che rispecchi davvero le sue preferenze.",
        category: "Consigli",
      },
      pt: {
        title: "Recomendar um prato",
        situation:
          "Um cliente diz que é a primeira vez dele em um sushi bar e não sabe o que pedir. O que você faz?",
        options: [
          "Recomenda o prato mais caro.",
          "Pergunta de quais sabores ou ingredientes ele gosta e sugere algumas opções.",
          "Diz que todos os pratos são praticamente iguais.",
          "Escolhe por ele sem perguntar nada.",
        ],
        explanation:
          "Primeiro descubra as preferências do cliente. Assim você pode recomendar algo que realmente combine com o gosto dele.",
        category: "Recomendações",
      },
    },
    correct: 1,
  },
  {
    id: 4,
    category: "Allergies",
    difficulty: "hard",
    translations: {
      es: {
        title: "Una posible alergia",
        situation:
          "Un cliente te dice que es alérgico a los frutos secos y pregunta si un plato contiene alguno. ¿Qué haces?",
        options: [
          "Le dices que seguramente no contiene frutos secos.",
          "Le recomiendas quitar los frutos secos después de servirlo.",
          "Verificas los ingredientes y el riesgo de contaminación cruzada con cocina antes de responder.",
          "Le aseguras que puede comerlo porque nunca has visto frutos secos en ese plato.",
        ],
        explanation:
          "Las alergias deben tratarse con seriedad. Confirma ingredientes y posibles contaminaciones cruzadas con el equipo responsable. No prometas que un plato es seguro sin verificarlo.",
        category: "Alergias",
      },
      en: {
        title: "A possible allergy",
        situation:
          "A customer tells you they are allergic to nuts and asks whether a dish contains any. What do you do?",
        options: [
          "Tell them it probably doesn't contain nuts.",
          "Suggest removing the nuts after the dish is served.",
          "Check the ingredients and possible cross-contact with the kitchen before answering.",
          "Guarantee it's safe because you've never seen nuts in that dish.",
        ],
        explanation:
          "Allergies must be taken seriously. Confirm ingredients and possible cross-contact with the responsible kitchen staff. Never guarantee a dish is safe without checking.",
        category: "Allergies",
      },
      it: {
        title: "Una possibile allergia",
        situation:
          "Un cliente ti dice di essere allergico alla frutta a guscio e chiede se un piatto la contiene. Cosa fai?",
        options: [
          "Dici che probabilmente non contiene frutta a guscio.",
          "Suggerisci di toglierla dopo aver servito il piatto.",
          "Verifichi gli ingredienti e il rischio di contaminazione crociata con la cucina prima di rispondere.",
          "Garantisci che sia sicuro perché non hai mai visto frutta a guscio in quel piatto.",
        ],
        explanation:
          "Le allergie devono essere prese sul serio. Verifica gli ingredienti e il rischio di contaminazione crociata con il personale responsabile. Non garantire mai la sicurezza senza aver controllato.",
        category: "Allergie",
      },
      pt: {
        title: "Uma possível alergia",
        situation:
          "Um cliente diz que é alérgico a castanhas e pergunta se um prato contém alguma. O que você faz?",
        options: [
          "Diz que provavelmente não contém castanhas.",
          "Sugere retirar as castanhas depois que o prato for servido.",
          "Confirma os ingredientes e o risco de contaminação cruzada com a cozinha antes de responder.",
          "Garante que é seguro porque nunca viu castanhas naquele prato.",
        ],
        explanation:
          "Alergias devem ser tratadas com seriedade. Confirme os ingredientes e possíveis contaminações cruzadas com a equipe responsável. Nunca garanta que um prato é seguro sem verificar.",
        category: "Alergias",
      },
    },
    correct: 2,
  },
  {
    id: 5,
    category: "Waiting time",
    difficulty: "medium",
    translations: {
      es: {
        title: "Demora en la cocina",
        situation:
          "Una mesa lleva bastante tiempo esperando sus platos. El cliente te pregunta cuánto falta, pero no tienes una estimación confirmada. ¿Qué respondes?",
        options: [
          "Le dices que saldrá en dos minutos, aunque no lo sabes.",
          "Ignoras la pregunta.",
          "Te disculpas, consultas el estado del pedido y vuelves con una actualización.",
          "Culpas directamente al personal de cocina.",
        ],
        explanation:
          "Comunica con honestidad. Discúlpate por la espera, consulta el estado del pedido y vuelve a informar al cliente.",
        category: "Tiempos de espera",
      },
      en: {
        title: "A delay in the kitchen",
        situation:
          "A table has been waiting quite a while for their food. A customer asks how much longer it will take, but you don't have a confirmed estimate. What do you say?",
        options: [
          "Tell them it will be ready in two minutes, even though you don't know.",
          "Ignore the question.",
          "Apologize, check the order's status, and return with an update.",
          "Blame the kitchen staff directly.",
        ],
        explanation:
          "Communicate honestly. Apologize for the wait, check the order's status, and return with an update.",
        category: "Waiting times",
      },
      it: {
        title: "Un ritardo in cucina",
        situation:
          "Un tavolo aspetta da parecchio tempo i propri piatti. Un cliente chiede quanto manca, ma non hai una stima confermata. Cosa rispondi?",
        options: [
          "Dici che sarà pronto tra due minuti, anche se non lo sai.",
          "Ignori la domanda.",
          "Ti scusi, controlli lo stato dell'ordine e torni con un aggiornamento.",
          "Dai direttamente la colpa al personale di cucina.",
        ],
        explanation:
          "Comunica con sincerità. Scusati per l'attesa, verifica lo stato dell'ordine e torna a informare il cliente.",
        category: "Tempi di attesa",
      },
      pt: {
        title: "Atraso na cozinha",
        situation:
          "Uma mesa está esperando há bastante tempo pelos pratos. Um cliente pergunta quanto falta, mas você não tem uma previsão confirmada. O que responde?",
        options: [
          "Diz que ficará pronto em dois minutos, mesmo sem saber.",
          "Ignora a pergunta.",
          "Pede desculpas, verifica o andamento do pedido e volta com uma atualização.",
          "Culpa diretamente a equipe da cozinha.",
        ],
        explanation:
          "Comunique-se com honestidade. Peça desculpas pela espera, verifique o pedido e volte para informar o cliente.",
        category: "Tempo de espera",
      },
    },
    correct: 2,
  },
  {
    id: 6,
    category: "Order mistake",
    difficulty: "medium",
    translations: {
      es: {
        title: "Un plato equivocado",
        situation:
          "Llevas un plato a una mesa y el cliente te dice amablemente que no es lo que pidió. ¿Cómo reaccionas?",
        options: [
          "Le dices que eso fue lo que anotaste.",
          "Te disculpas, retiras el plato si corresponde y verificas el pedido.",
          "Le pides que lo acepte porque ya está preparado.",
          "Le dices que debe hablar con otro camarero.",
        ],
        explanation:
          "Mantén la calma, reconoce el problema y busca solucionarlo. Verifica el pedido antes de dar una respuesta.",
        category: "Errores en pedidos",
      },
      en: {
        title: "The wrong dish",
        situation:
          "You bring a dish to a table and the customer politely tells you it isn't what they ordered. How do you react?",
        options: [
          "Tell them that's what you wrote down.",
          "Apologize, take the dish back if appropriate, and check the order.",
          "Ask them to accept it because it's already prepared.",
          "Tell them they need to speak to another waiter.",
        ],
        explanation:
          "Stay calm, acknowledge the problem, and work to solve it. Check the order before responding.",
        category: "Order mistakes",
      },
      it: {
        title: "Il piatto sbagliato",
        situation:
          "Porti un piatto a un tavolo e il cliente ti dice gentilmente che non è quello che aveva ordinato. Come reagisci?",
        options: [
          "Dici che è quello che avevi annotato.",
          "Ti scusi, ritiri il piatto se necessario e controlli l'ordine.",
          "Chiedi al cliente di accettarlo perché è già pronto.",
          "Dici che deve parlare con un altro cameriere.",
        ],
        explanation:
          "Mantieni la calma, riconosci il problema e cerca di risolverlo. Controlla l'ordine prima di rispondere.",
        category: "Errori negli ordini",
      },
      pt: {
        title: "O prato errado",
        situation:
          "Você leva um prato à mesa e o cliente diz educadamente que não foi aquilo que pediu. Como reage?",
        options: [
          "Diz que foi isso que você anotou.",
          "Pede desculpas, retira o prato se necessário e confere o pedido.",
          "Pede ao cliente que aceite porque já está preparado.",
          "Diz que ele precisa falar com outro garçom.",
        ],
        explanation:
          "Mantenha a calma, reconheça o problema e procure resolvê-lo. Confira o pedido antes de responder.",
        category: "Erros nos pedidos",
      },
    },
    correct: 1,
  },
  {
    id: 7,
    category: "Checking back",
    difficulty: "easy",
    translations: {
      es: {
        title: "Comprobar si todo está bien",
        situation:
          "Acabas de servir los platos. ¿Cuál es la mejor manera de comprobar que los clientes están conformes?",
        options: [
          "Les preguntas inmediatamente si quieren la cuenta.",
          "Te alejas y no vuelves a la mesa.",
          "Después de darles un momento, te acercas y preguntas si está todo bien.",
          "Les preguntas varias veces seguidas si les gusta la comida.",
        ],
        explanation:
          "Un breve seguimiento en el momento adecuado demuestra atención sin interrumpir demasiado la experiencia.",
        category: "Atención durante la comida",
      },
      en: {
        title: "Checking that everything is alright",
        situation:
          "You've just served the dishes. What's the best way to check that the customers are happy?",
        options: [
          "Immediately ask whether they want the bill.",
          "Walk away and never return to the table.",
          "Give them a moment, then approach and ask if everything is alright.",
          "Ask several times in a row whether they like the food.",
        ],
        explanation:
          "A brief check-in at the right moment shows attentiveness without interrupting the experience too much.",
        category: "Checking back",
      },
      it: {
        title: "Verificare che sia tutto a posto",
        situation:
          "Hai appena servito i piatti. Qual è il modo migliore per verificare che i clienti siano soddisfatti?",
        options: [
          "Chiedi subito se vogliono il conto.",
          "Ti allontani e non torni più al tavolo.",
          "Lasci loro un momento, poi ti avvicini e chiedi se va tutto bene.",
          "Chiedi più volte di seguito se il cibo è di loro gradimento.",
        ],
        explanation:
          "Un breve controllo al momento giusto dimostra attenzione senza interrompere troppo l'esperienza.",
        category: "Controllo al tavolo",
      },
      pt: {
        title: "Verificar se está tudo bem",
        situation:
          "Você acabou de servir os pratos. Qual é a melhor maneira de verificar se os clientes estão satisfeitos?",
        options: [
          "Perguntar imediatamente se querem a conta.",
          "Afastar-se e nunca mais voltar à mesa.",
          "Dar um momento a eles e depois perguntar se está tudo bem.",
          "Perguntar várias vezes seguidas se estão gostando da comida.",
        ],
        explanation:
          "Uma breve verificação no momento certo demonstra atenção sem interromper demais a experiência.",
        category: "Acompanhamento",
      },
    },
    correct: 2,
  },
  {
    id: 8,
    category: "Payment",
    difficulty: "medium",
    translations: {
      es: {
        title: "La cuenta",
        situation:
          "Un cliente te pide la cuenta y te dice que tiene prisa. ¿Qué haces?",
        options: [
          "Le dices que tendrá que esperar como todos.",
          "Confirmas que la cuenta corresponda a su mesa y se la llevas lo antes posible.",
          "Le cobras sin mostrarle el detalle.",
          "Le dices que vaya directamente a la caja sin verificar el procedimiento.",
        ],
        explanation:
          "Responde con agilidad y verifica que la cuenta sea correcta. Respeta el procedimiento de cobro del establecimiento.",
        category: "Cobro",
      },
      en: {
        title: "The bill",
        situation:
          "A customer asks for the bill and tells you they're in a hurry. What do you do?",
        options: [
          "Tell them they'll have to wait like everyone else.",
          "Make sure the bill belongs to their table and bring it as quickly as possible.",
          "Charge them without showing the details.",
          "Tell them to go straight to the cashier without checking the procedure.",
        ],
        explanation:
          "Respond efficiently and make sure the bill is correct. Follow the restaurant's payment procedure.",
        category: "Payment",
      },
      it: {
        title: "Il conto",
        situation:
          "Un cliente ti chiede il conto e ti dice che ha fretta. Cosa fai?",
        options: [
          "Dici che dovrà aspettare come tutti gli altri.",
          "Verifichi che il conto corrisponda al suo tavolo e lo porti il prima possibile.",
          "Fai pagare senza mostrare i dettagli.",
          "Dici di andare direttamente alla cassa senza verificare la procedura.",
        ],
        explanation:
          "Rispondi con rapidità e verifica che il conto sia corretto. Rispetta la procedura di pagamento del locale.",
        category: "Pagamento",
      },
      pt: {
        title: "A conta",
        situation:
          "Um cliente pede a conta e diz que está com pressa. O que você faz?",
        options: [
          "Diz que ele terá que esperar como todos os outros.",
          "Confere se a conta corresponde à mesa e a leva o mais rápido possível.",
          "Faz a cobrança sem mostrar os detalhes.",
          "Diz para ir diretamente ao caixa sem verificar o procedimento.",
        ],
        explanation:
          "Responda com agilidade e confira se a conta está correta. Siga o procedimento de pagamento do estabelecimento.",
        category: "Pagamento",
      },
    },
    correct: 1,
  },
];

export function buildScenarioQuestions(language = "en") {
  return shuffleArray(SCENARIOS).map((scenario) => {
    const content =
      scenario.translations[language] || scenario.translations.en;

    return {
      id: scenario.id,
      category: content.category,
      title: content.title,
      situation: content.situation,
      options: content.options,
      explanation: content.explanation,
      correct: scenario.correct,
      difficulty: scenario.difficulty,
    };
  });
}
