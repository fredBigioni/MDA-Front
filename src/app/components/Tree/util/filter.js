export const defaultMatcher = (filterText, node) => {
    if (typeof filterText !== 'string') {
        filterText = String(filterText);
    }

    // Función recursiva para buscar coincidencias y devolver el nodo correspondiente
    const searchInNode = (node) => {
        // Verifica si el nodo tiene el valor 'customerMarket' y 'customMarketDescription'
        if (node.value && node.value.customerMarket && node.value.customerMarket.customMarketDescription) {
            const description = node.value.customerMarket.customMarketDescription.toLowerCase();
            const filter = filterText.toLowerCase();

            // Comprobar si las primeras 3 letras de 'filterText' coinciden con las primeras 3 letras de 'customMarketDescription'
            if (filter.length >= 3 && description.startsWith(filter)) {
                return node;
            }
        }

        // Si el nodo tiene hijos, realizar búsqueda recursiva en ellos
        if (node.children && node.children.length > 0) {
            for (let child of node.children) {
                const result = searchInNode(child);
                if (result) {
                    return result; // Retorna el nodo coincidente
                }
            }
        }

        // Si no se encuentra coincidencia, retorna null
        return null;
    };

    // Si el texto de filtro está vacío, retorna el nodo original completo
    if (filterText.trim() === '') {
        return node;
    }

    // Comenzar la búsqueda desde el nodo raíz
    return searchInNode(node) || node;
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