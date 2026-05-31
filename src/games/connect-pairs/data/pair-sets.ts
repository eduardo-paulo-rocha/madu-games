import type { PairSet } from '../logic/types';
import type { Difficulty } from '../../../core/registry/types';

const ALL_PAIR_SETS: PairSet[] = [
    // ──────────────────────────────────────────────
    // Categoria 1: Animais e Sons
    // ──────────────────────────────────────────────
    {
        id: 'animais-sons-easy-1',
        category: 'Animais e Sons',
        difficulty: 'easy',
        pairs: [
            { left: { id: 'as1e1-gato', display: '🐱 Gato' }, right: { id: 'as1e1-miau', display: 'Miau' } },
            { left: { id: 'as1e1-cachorro', display: '🐶 Cachorro' }, right: { id: 'as1e1-auau', display: 'Au au' } },
            { left: { id: 'as1e1-vaca', display: '🐄 Vaca' }, right: { id: 'as1e1-mu', display: 'Muuu' } },
            { left: { id: 'as1e1-sapo', display: '🐸 Sapo' }, right: { id: 'as1e1-coaxo', display: 'Coaxo' } },
        ],
    },
    {
        id: 'animais-sons-easy-2',
        category: 'Animais e Sons',
        difficulty: 'easy',
        pairs: [
            { left: { id: 'as1e2-pinto', display: '🐤 Pinto' }, right: { id: 'as1e2-piu', display: 'Piu piu' } },
            { left: { id: 'as1e2-galo', display: '🐓 Galo' }, right: { id: 'as1e2-cocori', display: 'Cocoricó' } },
            { left: { id: 'as1e2-pato', display: '🦆 Pato' }, right: { id: 'as1e2-qua', display: 'Quá quá' } },
            { left: { id: 'as1e2-ovelha', display: '🐑 Ovelha' }, right: { id: 'as1e2-bee', display: 'Beee' } },
        ],
    },
    {
        id: 'animais-sons-medium-1',
        category: 'Animais e Sons',
        difficulty: 'medium',
        pairs: [
            { left: { id: 'as1m1-leao', display: '🦁 Leão' }, right: { id: 'as1m1-rugido', display: 'Rugido' } },
            { left: { id: 'as1m1-elefante', display: '🐘 Elefante' }, right: { id: 'as1m1-barrido', display: 'Barrido' } },
            { left: { id: 'as1m1-abelha', display: '🐝 Abelha' }, right: { id: 'as1m1-zumbido', display: 'Zumbido' } },
            { left: { id: 'as1m1-cavalo', display: '🐴 Cavalo' }, right: { id: 'as1m1-relincho', display: 'Relincho' } },
            { left: { id: 'as1m1-porco', display: '🐷 Porco' }, right: { id: 'as1m1-grunhido', display: 'Grunhido' } },
        ],
    },
    {
        id: 'animais-sons-medium-2',
        category: 'Animais e Sons',
        difficulty: 'medium',
        pairs: [
            { left: { id: 'as1m2-lobo', display: '🐺 Lobo' }, right: { id: 'as1m2-uivo', display: 'Uivo' } },
            { left: { id: 'as1m2-coruja', display: '🦉 Coruja' }, right: { id: 'as1m2-piado', display: 'Piado' } },
            { left: { id: 'as1m2-grilo', display: '🦗 Grilo' }, right: { id: 'as1m2-cricri', display: 'Cri cri' } },
            { left: { id: 'as1m2-cobra', display: '🐍 Cobra' }, right: { id: 'as1m2-assobio', display: 'Assobio' } },
            { left: { id: 'as1m2-macaco', display: '🐒 Macaco' }, right: { id: 'as1m2-uhuh', display: 'Uh uh' } },
        ],
    },
    {
        id: 'animais-sons-hard-1',
        category: 'Animais e Sons',
        difficulty: 'hard',
        pairs: [
            { left: { id: 'as1h1-leao', display: '🦁 Leão' }, right: { id: 'as1h1-rugido', display: 'Rugido' } },
            { left: { id: 'as1h1-elefante', display: '🐘 Elefante' }, right: { id: 'as1h1-barrido', display: 'Barrido' } },
            { left: { id: 'as1h1-cavalo', display: '🐴 Cavalo' }, right: { id: 'as1h1-relincho', display: 'Relincho' } },
            { left: { id: 'as1h1-abelha', display: '🐝 Abelha' }, right: { id: 'as1h1-zumbido', display: 'Zumbido' } },
            { left: { id: 'as1h1-lobo', display: '🐺 Lobo' }, right: { id: 'as1h1-uivo', display: 'Uivo' } },
            { left: { id: 'as1h1-porco', display: '🐷 Porco' }, right: { id: 'as1h1-grunhido', display: 'Grunhido' } },
        ],
    },
    {
        id: 'animais-sons-hard-2',
        category: 'Animais e Sons',
        difficulty: 'hard',
        pairs: [
            { left: { id: 'as1h2-grilo', display: '🦗 Grilo' }, right: { id: 'as1h2-cricri', display: 'Cri cri' } },
            { left: { id: 'as1h2-coruja', display: '🦉 Coruja' }, right: { id: 'as1h2-piado', display: 'Piado' } },
            { left: { id: 'as1h2-cobra', display: '🐍 Cobra' }, right: { id: 'as1h2-assobio', display: 'Assobio' } },
            { left: { id: 'as1h2-macaco', display: '🐒 Macaco' }, right: { id: 'as1h2-uhuh', display: 'Uh uh' } },
            { left: { id: 'as1h2-papagaio', display: '🦜 Papagaio' }, right: { id: 'as1h2-imitar', display: 'Imita fala' } },
            { left: { id: 'as1h2-pato', display: '🦆 Pato' }, right: { id: 'as1h2-qua', display: 'Quá quá' } },
        ],
    },

    // ──────────────────────────────────────────────
    // Categoria 2: Profissões e Ferramentas
    // ──────────────────────────────────────────────
    {
        id: 'profissoes-easy-1',
        category: 'Profissões e Ferramentas',
        difficulty: 'easy',
        pairs: [
            { left: { id: 'pf2e1-medico', display: '👨‍⚕️ Médico' }, right: { id: 'pf2e1-esteto', display: 'Estetoscópio' } },
            { left: { id: 'pf2e1-cozinheiro', display: '👩‍🍳 Cozinheiro' }, right: { id: 'pf2e1-frigideira', display: 'Frigideira' } },
            { left: { id: 'pf2e1-professor', display: '👩‍🏫 Professor' }, right: { id: 'pf2e1-livro', display: 'Livro' } },
            { left: { id: 'pf2e1-pintor', display: '🎨 Pintor' }, right: { id: 'pf2e1-pincel', display: 'Pincel' } },
        ],
    },
    {
        id: 'profissoes-easy-2',
        category: 'Profissões e Ferramentas',
        difficulty: 'easy',
        pairs: [
            { left: { id: 'pf2e2-bombeiro', display: '🚒 Bombeiro' }, right: { id: 'pf2e2-mangueira', display: 'Mangueira' } },
            { left: { id: 'pf2e2-cabeleireiro', display: '💇 Cabeleireiro' }, right: { id: 'pf2e2-tesoura', display: 'Tesoura' } },
            { left: { id: 'pf2e2-mecanico', display: '🔧 Mecânico' }, right: { id: 'pf2e2-chave', display: 'Chave inglesa' } },
            { left: { id: 'pf2e2-policial', display: '👮 Policial' }, right: { id: 'pf2e2-algemas', display: 'Algemas' } },
        ],
    },
    {
        id: 'profissoes-medium-1',
        category: 'Profissões e Ferramentas',
        difficulty: 'medium',
        pairs: [
            { left: { id: 'pf2m1-futebol', display: '⚽ Jogador de futebol' }, right: { id: 'pf2m1-bola', display: 'Bola' } },
            { left: { id: 'pf2m1-musico', display: '🎵 Músico' }, right: { id: 'pf2m1-violao', display: 'Violão' } },
            { left: { id: 'pf2m1-cientista', display: '🔬 Cientista' }, right: { id: 'pf2m1-microscopio', display: 'Microscópio' } },
            { left: { id: 'pf2m1-fazendeiro', display: '🌾 Fazendeiro' }, right: { id: 'pf2m1-enxada', display: 'Enxada' } },
            { left: { id: 'pf2m1-costureira', display: '🪡 Costureira' }, right: { id: 'pf2m1-agulha', display: 'Agulha' } },
        ],
    },
    {
        id: 'profissoes-medium-2',
        category: 'Profissões e Ferramentas',
        difficulty: 'medium',
        pairs: [
            { left: { id: 'pf2m2-carteiro', display: '📦 Carteiro' }, right: { id: 'pf2m2-carta', display: 'Carta' } },
            { left: { id: 'pf2m2-enfermeiro', display: '💉 Enfermeiro' }, right: { id: 'pf2m2-seringa', display: 'Seringa' } },
            { left: { id: 'pf2m2-pedreiro', display: '🏗️ Pedreiro' }, right: { id: 'pf2m2-tijolo', display: 'Tijolo' } },
            { left: { id: 'pf2m2-jardineiro', display: '🌿 Jardineiro' }, right: { id: 'pf2m2-regador', display: 'Regador' } },
            { left: { id: 'pf2m2-padeiro', display: '🍞 Padeiro' }, right: { id: 'pf2m2-forma', display: 'Forma de pão' } },
        ],
    },
    {
        id: 'profissoes-hard-1',
        category: 'Profissões e Ferramentas',
        difficulty: 'hard',
        pairs: [
            { left: { id: 'pf2h1-ator', display: '🎭 Ator' }, right: { id: 'pf2h1-mascara', display: 'Máscara' } },
            { left: { id: 'pf2h1-astronomo', display: '🔭 Astrônomo' }, right: { id: 'pf2h1-telescopio', display: 'Telescópio' } },
            { left: { id: 'pf2h1-dentista', display: '🦷 Dentista' }, right: { id: 'pf2h1-broca', display: 'Broca' } },
            { left: { id: 'pf2h1-arquiteto', display: '📐 Arquiteto' }, right: { id: 'pf2h1-regua', display: 'Régua' } },
            { left: { id: 'pf2h1-marinheiro', display: '🚢 Marinheiro' }, right: { id: 'pf2h1-ancora', display: 'Âncora' } },
            { left: { id: 'pf2h1-cantor', display: '🎤 Cantor' }, right: { id: 'pf2h1-microfone', display: 'Microfone' } },
        ],
    },
    {
        id: 'profissoes-hard-2',
        category: 'Profissões e Ferramentas',
        difficulty: 'hard',
        pairs: [
            { left: { id: 'pf2h2-programador', display: '💻 Programador' }, right: { id: 'pf2h2-computador', display: 'Computador' } },
            { left: { id: 'pf2h2-lutador', display: '🥊 Lutador' }, right: { id: 'pf2h2-luvas', display: 'Luvas de boxe' } },
            { left: { id: 'pf2h2-pescador', display: '🎣 Pescador' }, right: { id: 'pf2h2-vara', display: 'Vara de pesca' } },
            { left: { id: 'pf2h2-nadador', display: '🏊 Nadador' }, right: { id: 'pf2h2-oculos', display: 'Óculos de natação' } },
            { left: { id: 'pf2h2-violinista', display: '🎻 Violinista' }, right: { id: 'pf2h2-violino', display: 'Violino' } },
            { left: { id: 'pf2h2-fotografo', display: '📷 Fotógrafo' }, right: { id: 'pf2h2-camera', display: 'Câmera' } },
        ],
    },

    // ──────────────────────────────────────────────
    // Categoria 3: Alimentos e Origem
    // ──────────────────────────────────────────────
    {
        id: 'alimentos-easy-1',
        category: 'Alimentos e Origem',
        difficulty: 'easy',
        pairs: [
            { left: { id: 'ao3e1-leite', display: '🥛 Leite' }, right: { id: 'ao3e1-vaca', display: 'Vaca' } },
            { left: { id: 'ao3e1-ovo', display: '🥚 Ovo' }, right: { id: 'ao3e1-galinha', display: 'Galinha' } },
            { left: { id: 'ao3e1-mel', display: '🍯 Mel' }, right: { id: 'ao3e1-abelha', display: 'Abelha' } },
            { left: { id: 'ao3e1-la', display: '🧶 Lã' }, right: { id: 'ao3e1-ovelha', display: 'Ovelha' } },
        ],
    },
    {
        id: 'alimentos-easy-2',
        category: 'Alimentos e Origem',
        difficulty: 'easy',
        pairs: [
            { left: { id: 'ao3e2-maca', display: '🍎 Maçã' }, right: { id: 'ao3e2-macieira', display: 'Macieira' } },
            { left: { id: 'ao3e2-laranja', display: '🍊 Laranja' }, right: { id: 'ao3e2-laranjeira', display: 'Laranjeira' } },
            { left: { id: 'ao3e2-banana', display: '🍌 Banana' }, right: { id: 'ao3e2-bananeira', display: 'Bananeira' } },
            { left: { id: 'ao3e2-morango', display: '🍓 Morango' }, right: { id: 'ao3e2-pe', display: 'Pé de morango' } },
        ],
    },
    {
        id: 'alimentos-medium-1',
        category: 'Alimentos e Origem',
        difficulty: 'medium',
        pairs: [
            { left: { id: 'ao3m1-queijo', display: '🧀 Queijo' }, right: { id: 'ao3m1-leite', display: 'Leite' } },
            { left: { id: 'ao3m1-chocolate', display: '🍫 Chocolate' }, right: { id: 'ao3m1-cacau', display: 'Cacau' } },
            { left: { id: 'ao3m1-pao', display: '🍞 Pão' }, right: { id: 'ao3m1-trigo', display: 'Trigo' } },
            { left: { id: 'ao3m1-vinho', display: '🍷 Vinho' }, right: { id: 'ao3m1-uva', display: 'Uva' } },
            { left: { id: 'ao3m1-cafe', display: '☕ Café' }, right: { id: 'ao3m1-cafezal', display: 'Cafeeiro' } },
        ],
    },
    {
        id: 'alimentos-medium-2',
        category: 'Alimentos e Origem',
        difficulty: 'medium',
        pairs: [
            { left: { id: 'ao3m2-arroz', display: '🍚 Arroz' }, right: { id: 'ao3m2-arrozal', display: 'Arrozal' } },
            { left: { id: 'ao3m2-acucar', display: '🍬 Açúcar' }, right: { id: 'ao3m2-cana', display: 'Cana-de-açúcar' } },
            { left: { id: 'ao3m2-azeite', display: '🫒 Azeite' }, right: { id: 'ao3m2-azeitona', display: 'Azeitona' } },
            { left: { id: 'ao3m2-manteiga', display: '🧈 Manteiga' }, right: { id: 'ao3m2-creme', display: 'Nata do leite' } },
            { left: { id: 'ao3m2-milho', display: '🌽 Milho' }, right: { id: 'ao3m2-milharal', display: 'Milharal' } },
        ],
    },
    {
        id: 'alimentos-hard-1',
        category: 'Alimentos e Origem',
        difficulty: 'hard',
        pairs: [
            { left: { id: 'ao3h1-uva', display: '🍇 Uva' }, right: { id: 'ao3h1-vinhedo', display: 'Vinhedo' } },
            { left: { id: 'ao3h1-azeitona', display: '🫒 Azeitona' }, right: { id: 'ao3h1-oliveira', display: 'Oliveira' } },
            { left: { id: 'ao3h1-mel', display: '🍯 Mel' }, right: { id: 'ao3h1-colmeia', display: 'Colmeia' } },
            { left: { id: 'ao3h1-cogumelo', display: '🍄 Cogumelo' }, right: { id: 'ao3h1-floresta', display: 'Floresta' } },
            { left: { id: 'ao3h1-lagosta', display: '🦞 Lagosta' }, right: { id: 'ao3h1-oceano', display: 'Oceano' } },
            { left: { id: 'ao3h1-semente', display: '🌱 Broto' }, right: { id: 'ao3h1-terra', display: 'Terra' } },
        ],
    },
    {
        id: 'alimentos-hard-2',
        category: 'Alimentos e Origem',
        difficulty: 'hard',
        pairs: [
            { left: { id: 'ao3h2-feijao', display: '🫘 Feijão' }, right: { id: 'ao3h2-pe-feijao', display: 'Pé de feijão' } },
            { left: { id: 'ao3h2-camarao', display: '🍤 Camarão' }, right: { id: 'ao3h2-mar', display: 'Mar ou rio' } },
            { left: { id: 'ao3h2-amendoim', display: '🥜 Amendoim' }, right: { id: 'ao3h2-solo', display: 'Debaixo da terra' } },
            { left: { id: 'ao3h2-bacon', display: '🥓 Bacon' }, right: { id: 'ao3h2-porco', display: 'Porco' } },
            { left: { id: 'ao3h2-suco', display: '🍹 Suco de laranja' }, right: { id: 'ao3h2-laranja2', display: 'Laranja' } },
            { left: { id: 'ao3h2-tomate', display: '🍅 Molho de tomate' }, right: { id: 'ao3h2-tomateiro', display: 'Tomateiro' } },
        ],
    },

    // ──────────────────────────────────────────────
    // Categoria 4: Objetos e Funções
    // ──────────────────────────────────────────────
    {
        id: 'objetos-easy-1',
        category: 'Objetos e Funções',
        difficulty: 'easy',
        pairs: [
            { left: { id: 'of4e1-tesoura', display: '✂️ Tesoura' }, right: { id: 'of4e1-cortar', display: 'Cortar' } },
            { left: { id: 'of4e1-caneta', display: '🖊️ Caneta' }, right: { id: 'of4e1-escrever', display: 'Escrever' } },
            { left: { id: 'of4e1-lanterna', display: '🔦 Lanterna' }, right: { id: 'of4e1-iluminar', display: 'Iluminar' } },
            { left: { id: 'of4e1-vassoura', display: '🧹 Vassoura' }, right: { id: 'of4e1-varrer', display: 'Varrer' } },
        ],
    },
    {
        id: 'objetos-easy-2',
        category: 'Objetos e Funções',
        difficulty: 'easy',
        pairs: [
            { left: { id: 'of4e2-chave', display: '🔑 Chave' }, right: { id: 'of4e2-abrir', display: 'Abrir porta' } },
            { left: { id: 'of4e2-telefone', display: '📱 Telefone' }, right: { id: 'of4e2-ligar', display: 'Ligar' } },
            { left: { id: 'of4e2-lupa', display: '🔍 Lupa' }, right: { id: 'of4e2-ampliar', display: 'Ampliar' } },
            { left: { id: 'of4e2-termometro', display: '🌡️ Termômetro' }, right: { id: 'of4e2-temperatura', display: 'Medir temperatura' } },
        ],
    },
    {
        id: 'objetos-medium-1',
        category: 'Objetos e Funções',
        difficulty: 'medium',
        pairs: [
            { left: { id: 'of4m1-balde', display: '🪣 Balde' }, right: { id: 'of4m1-agua', display: 'Carregar água' } },
            { left: { id: 'of4m1-ima', display: '🧲 Ímã' }, right: { id: 'of4m1-atrair', display: 'Atrair metal' } },
            { left: { id: 'of4m1-escada', display: '🪜 Escada' }, right: { id: 'of4m1-subir', display: 'Subir' } },
            { left: { id: 'of4m1-extintor', display: '🧯 Extintor' }, right: { id: 'of4m1-fogo', display: 'Apagar fogo' } },
            { left: { id: 'of4m1-mochila', display: '🎒 Mochila' }, right: { id: 'of4m1-carregar', display: 'Carregar coisas' } },
        ],
    },
    {
        id: 'objetos-medium-2',
        category: 'Objetos e Funções',
        difficulty: 'medium',
        pairs: [
            { left: { id: 'of4m2-mala', display: '🧳 Mala' }, right: { id: 'of4m2-roupas', display: 'Guardar roupas' } },
            { left: { id: 'of4m2-bussola', display: '🧭 Bússola' }, right: { id: 'of4m2-direcao', display: 'Indicar direção' } },
            { left: { id: 'of4m2-despertador', display: '⏰ Despertador' }, right: { id: 'of4m2-acordar', display: 'Acordar' } },
            { left: { id: 'of4m2-radio', display: '📻 Rádio' }, right: { id: 'of4m2-ouvir', display: 'Ouvir músicas' } },
            { left: { id: 'of4m2-remedio', display: '💊 Remédio' }, right: { id: 'of4m2-curar', display: 'Curar doenças' } },
        ],
    },
    {
        id: 'objetos-hard-1',
        category: 'Objetos e Funções',
        difficulty: 'hard',
        pairs: [
            { left: { id: 'of4h1-telescopio', display: '🔭 Telescópio' }, right: { id: 'of4h1-estrelas', display: 'Observar estrelas' } },
            { left: { id: 'of4h1-microscopio', display: '🔬 Microscópio' }, right: { id: 'of4h1-bacterias', display: 'Ver bactérias' } },
            { left: { id: 'of4h1-impressora', display: '🖨️ Impressora' }, right: { id: 'of4h1-imprimir', display: 'Imprimir documentos' } },
            { left: { id: 'of4h1-antena', display: '📡 Antena' }, right: { id: 'of4h1-sinal', display: 'Transmitir sinal' } },
            { left: { id: 'of4h1-escudo', display: '🛡️ Escudo' }, right: { id: 'of4h1-proteger', display: 'Proteger' } },
            { left: { id: 'of4h1-haltere', display: '🏋️ Haltere' }, right: { id: 'of4h1-musculos', display: 'Fortalecer músculos' } },
        ],
    },
    {
        id: 'objetos-hard-2',
        category: 'Objetos e Funções',
        difficulty: 'hard',
        pairs: [
            { left: { id: 'of4h2-esteto', display: '🩺 Estetoscópio' }, right: { id: 'of4h2-coracao', display: 'Ouvir coração' } },
            { left: { id: 'of4h2-parakdas', display: '🪂 Paraquedas' }, right: { id: 'of4h2-saltar', display: 'Saltar de avião' } },
            { left: { id: 'of4h2-guitarra', display: '🎸 Guitarra' }, right: { id: 'of4h2-musica', display: 'Fazer música' } },
            { left: { id: 'of4h2-funil', display: '🌪️ Funil' }, right: { id: 'of4h2-liquido', display: 'Transferir líquido' } },
            { left: { id: 'of4h2-rede', display: '🕸️ Rede de pesca' }, right: { id: 'of4h2-pescar', display: 'Pescar' } },
            { left: { id: 'of4h2-regua', display: '📏 Régua' }, right: { id: 'of4h2-medir', display: 'Medir comprimento' } },
        ],
    },

    // ──────────────────────────────────────────────
    // Categoria 5: Emoji e Palavra
    // ──────────────────────────────────────────────
    {
        id: 'emoji-palavra-easy-1',
        category: 'Emoji e Palavra',
        difficulty: 'easy',
        pairs: [
            { left: { id: 'ep5e1-sol', display: '🌞' }, right: { id: 'ep5e1-sol-p', display: 'Sol' } },
            { left: { id: 'ep5e1-lua', display: '🌙' }, right: { id: 'ep5e1-lua-p', display: 'Lua' } },
            { left: { id: 'ep5e1-estrela', display: '⭐' }, right: { id: 'ep5e1-estrela-p', display: 'Estrela' } },
            { left: { id: 'ep5e1-nuvem', display: '☁️' }, right: { id: 'ep5e1-nuvem-p', display: 'Nuvem' } },
        ],
    },
    {
        id: 'emoji-palavra-easy-2',
        category: 'Emoji e Palavra',
        difficulty: 'easy',
        pairs: [
            { left: { id: 'ep5e2-onda', display: '🌊' }, right: { id: 'ep5e2-onda-p', display: 'Onda' } },
            { left: { id: 'ep5e2-fogo', display: '🔥' }, right: { id: 'ep5e2-fogo-p', display: 'Fogo' } },
            { left: { id: 'ep5e2-neve', display: '❄️' }, right: { id: 'ep5e2-neve-p', display: 'Neve' } },
            { left: { id: 'ep5e2-arco', display: '🌈' }, right: { id: 'ep5e2-arco-p', display: 'Arco-íris' } },
        ],
    },
    {
        id: 'emoji-palavra-medium-1',
        category: 'Emoji e Palavra',
        difficulty: 'medium',
        pairs: [
            { left: { id: 'ep5m1-casa', display: '🏠' }, right: { id: 'ep5m1-casa-p', display: 'Casa' } },
            { left: { id: 'ep5m1-carro', display: '🚗' }, right: { id: 'ep5m1-carro-p', display: 'Carro' } },
            { left: { id: 'ep5m1-aviao', display: '✈️' }, right: { id: 'ep5m1-aviao-p', display: 'Avião' } },
            { left: { id: 'ep5m1-foguete', display: '🚀' }, right: { id: 'ep5m1-foguete-p', display: 'Foguete' } },
            { left: { id: 'ep5m1-trofeu', display: '🏆' }, right: { id: 'ep5m1-trofeu-p', display: 'Troféu' } },
        ],
    },
    {
        id: 'emoji-palavra-medium-2',
        category: 'Emoji e Palavra',
        difficulty: 'medium',
        pairs: [
            { left: { id: 'ep5m2-diamante', display: '💎' }, right: { id: 'ep5m2-diamante-p', display: 'Diamante' } },
            { left: { id: 'ep5m2-flor', display: '🌺' }, right: { id: 'ep5m2-flor-p', display: 'Flor' } },
            { left: { id: 'ep5m2-trevo', display: '🍀' }, right: { id: 'ep5m2-trevo-p', display: 'Trevo' } },
            { left: { id: 'ep5m2-borboleta', display: '🦋' }, right: { id: 'ep5m2-borboleta-p', display: 'Borboleta' } },
            { left: { id: 'ep5m2-palmeira', display: '🌴' }, right: { id: 'ep5m2-palmeira-p', display: 'Palmeira' } },
        ],
    },
    {
        id: 'emoji-palavra-hard-1',
        category: 'Emoji e Palavra',
        difficulty: 'hard',
        pairs: [
            { left: { id: 'ep5h1-unicornio', display: '🦄' }, right: { id: 'ep5h1-unicornio-p', display: 'Unicórnio' } },
            { left: { id: 'ep5h1-gelo', display: '🧊' }, right: { id: 'ep5h1-gelo-p', display: 'Gelo' } },
            { left: { id: 'ep5h1-vulcao', display: '🌋' }, right: { id: 'ep5h1-vulcao-p', display: 'Vulcão' } },
            { left: { id: 'ep5h1-ilha', display: '🏝️' }, right: { id: 'ep5h1-ilha-p', display: 'Ilha' } },
            { left: { id: 'ep5h1-folha', display: '🌿' }, right: { id: 'ep5h1-folha-p', display: 'Folha' } },
            { left: { id: 'ep5h1-pedra', display: '🪨' }, right: { id: 'ep5h1-pedra-p', display: 'Pedra' } },
        ],
    },
    {
        id: 'emoji-palavra-hard-2',
        category: 'Emoji e Palavra',
        difficulty: 'hard',
        pairs: [
            { left: { id: 'ep5h2-ima', display: '🧲' }, right: { id: 'ep5h2-ima-p', display: 'Ímã' } },
            { left: { id: 'ep5h2-termometro', display: '🌡️' }, right: { id: 'ep5h2-termometro-p', display: 'Termômetro' } },
            { left: { id: 'ep5h2-ancora', display: '⚓' }, right: { id: 'ep5h2-ancora-p', display: 'Âncora' } },
            { left: { id: 'ep5h2-alvo', display: '🎯' }, right: { id: 'ep5h2-alvo-p', display: 'Alvo' } },
            { left: { id: 'ep5h2-quebra', display: '🧩' }, right: { id: 'ep5h2-quebra-p', display: 'Quebra-cabeça' } },
            { left: { id: 'ep5h2-bussola', display: '🧭' }, right: { id: 'ep5h2-bussola-p', display: 'Bússola' } },
        ],
    },
];

export function getPairSetsByDifficulty(difficulty: Difficulty): PairSet[] {
    return ALL_PAIR_SETS.filter((ps) => ps.difficulty === difficulty);
}

export function selectPairSet(difficulty: Difficulty, excludeCategory?: string): PairSet {
    const candidates = getPairSetsByDifficulty(difficulty).filter(
        (ps) => !excludeCategory || ps.category !== excludeCategory,
    );
    const pool = candidates.length > 0 ? candidates : getPairSetsByDifficulty(difficulty);
    return pool[Math.floor(Math.random() * pool.length)]!;
}
