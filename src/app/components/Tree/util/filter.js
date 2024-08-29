export const defaultMatcher = (filterText, node) => {
    if (typeof filterText !== 'string') {
        filterText = String(filterText);
    }

    const filter = filterText.toLowerCase();

    // Función recursiva para buscar coincidencias y devolver los nodos correspondientes
    const searchInNode = (node) => {
        const matches = [];

        // Si el nodo tiene la descripción del mercado, verificamos la coincidencia
        if (node.value && node.value.customerMarket && node.value.customerMarket.customMarketDescription) {
            const description = node.value.customerMarket.customMarketDescription.toLowerCase();

            // Si el filtro está contenido en la descripción
            if (description.includes(filter)) {
                matches.push(node);
            }
        }

        // Buscar recursivamente en los hijos
        if (node.children && node.children.length > 0) {
            for (let child of node.children) {
                const childMatches = searchInNode(child);
                matches.push(...childMatches); // Agrega los resultados del hijo al array de coincidencias
            }
        }

        return matches;
    };

    // Si el filtro está vacío, retorna el nodo completo
    if (filter.trim() === '') {
        return node;
    }

    // Comenzar la búsqueda desde el nodo raíz
    const matchedNodes = searchInNode(node);

    // Ordenar los resultados: las coincidencias exactas primero
    matchedNodes.sort((a, b) => {
        const descriptionA = a.value.customerMarket.customMarketDescription.toLowerCase();
        const descriptionB = b.value.customerMarket.customMarketDescription.toLowerCase();
        return descriptionA.indexOf(filter) - descriptionB.indexOf(filter);
    });

    // Si hay resultados, devolver el nodo con los hijos coincidentes ordenados
    if (matchedNodes.length > 0) {
        return { ...node, children: matchedNodes };
    }

    // Si no se encuentra coincidencia exacta, devolver el nodo original (sin modificar)
    return node;
};


// Encuentra nodos que coinciden o tienen hijos que coinciden
export const findNode = (node, filter, matcher) => {
    return matcher(filter, node) ||
        (node.children &&
            node.children.length &&
            !!node.children.find(child => findNode(child, filter, matcher)));
};

export const filterTree = (node, filter, matcher = defaultMatcher) => {
    if (!node) return null;

    // Verifica si el nodo actual coincide con el filtro utilizando matcher
    const matchedNode = matcher(filter, node);

    // Si el nodo coincide completamente con el filtro, se devuelve como está
    if (matchedNode && matchedNode !== node) {
        return matchedNode;
    }

    // Si el nodo tiene hijos, filtra y mapea los hijos
    const filteredChildren = node.children
        ? node.children
            .map(child => filterTree(child, filter, matcher)) // Llamada recursiva
            .filter(child => child !== null) // Filtra los hijos que son nulos
        : [];

    // Si el nodo tiene hijos que coinciden, devuelve el nodo con los hijos filtrados
    if (filteredChildren.length > 0) {
        return { ...node, children: filteredChildren };
    }

    // Si el nodo no coincide y no tiene hijos coincidentes, devuelve null
    return matchedNode ? node : null;
};



export const expandFilteredNodes = (node, filter, matcher = defaultMatcher) => {
    let children = node.children;
    if (!children || children.length === 0) {
        return Object.assign({}, node, { toggled: false });
    }
    const childrenWithMatches = node.children.filter(child => findNode(child, filter, matcher));
    const shouldExpand = childrenWithMatches.length > 0;
    // If im going to expand, go through all the matches and see if thier children need to expand
    if (shouldExpand) {
        children = childrenWithMatches.map(child => {
            return expandFilteredNodes(child, filter, matcher);
        });
    }
    return Object.assign({}, node, {
        children: children,
        toggled: shouldExpand
    });
};