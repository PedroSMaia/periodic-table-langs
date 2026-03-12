export const DEVICONS = {
    "Python":"python", "JavaScript":"javascript", "TypeScript":"typescript",
    "React":"react", "Vue":"vuejs", "Svelte":"svelte",
    "Go":"go", "Rust":"rust", "C":"c", "C++":"cplusplus", "C#":"csharp",
    "Java":"java", "Kotlin":"kotlin", "Swift":"swift", "Dart":"dart",
    "PHP":"php", "Ruby":"ruby", "Scala":"scala", "Haskell":"haskell",
    "Elixir":"elixir", "Erlang":"erlang", "Clojure":"clojure",
    "Lua":"lua", "Perl":"perl", "R":"r", "MATLAB":"matlab",
    "Bash":"bash", "PowerShell":"powershell", "Docker":"docker",
    "HTML":"html5", "CSS":"css3", "SASS":"sass", "GraphQL":"graphql",
    "Julia":"julia", "OCaml":"ocaml", "F#":"fsharp",
};

export const deviconUrl = (name) => {
    const d = DEVICONS[name];
    if (!d) return null;
    return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${d}/${d}-original.svg`;
};