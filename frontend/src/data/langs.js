export const LANGS = [
    // ── SYSTEMS ─────────────────────────────────────────────────────
    {
        id: 1, sym: "As", name: "Assembly", cat: "systems", year: 1947, paradigm: "Low-level · Imperative",
        desc: "Closest to bare metal. Direct machine instructions. Used in OS kernels, embedded systems, and hot paths where every cycle counts.",
        links: {
            wiki: "https://en.wikipedia.org/wiki/Assembly_language",
            docs: "https://www.nasm.us/doc/",
            playground: "https://godbolt.org/",
            github: "https://github.com/netwide-assembler/nasm",
            spec: "https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html",
            reddit: "https://www.reddit.com/r/asm/"
        },
        tutorials: [{
            name: "NASM Tutorial",
            url: "https://cs.lmu.edu/~ray/notes/nasmtutorial/"
        }, {
            name: "x86 Assembly Guide",
            url: "https://www.cs.virginia.edu/~evans/cs216/guides/x86.html"
        }, {name: "Tutorialspoint", url: "https://www.tutorialspoint.com/assembly_programming/"}, {
            "name": "OSDev Wiki",
            "url": "https://wiki.osdev.org/Assembly"
        }, {"name": "Compiler Explorer", "url": "https://godbolt.org/"}, {
            "name": "MASM32 SDK",
            "url": "https://www.masm32.com/"
        }],
        frameworks: [],
        tools: [{name: "NASM", url: "https://www.nasm.us/", desc: "Netwide Assembler"}, {
            name: "MASM",
            url: "https://learn.microsoft.com/en-us/cpp/assembler/masm/",
            desc: "Microsoft Macro Assembler"
        }, {name: "GAS", url: "https://sourceware.org/binutils/docs/as/", desc: "GNU Assembler"}],
        packages: [],
        package_manager: null
    },

    {
        id: 2, sym: "C", name: "C", cat: "systems", year: 1972, paradigm: "Procedural · Imperative",
        desc: "The mother of modern programming. Powers Linux, Windows, and virtually every embedded system on Earth. Foundational to nearly every major language.",
        links: {
            wiki: "https://en.wikipedia.org/wiki/C_(programming_language)",
            docs: "https://devdocs.io/c/",
            spec: "https://www.iso.org/standard/74528.html",
            playground: "https://www.onlinegdb.com/online_c_compiler",
            reddit: "https://www.reddit.com/r/C_Programming/"
        },
        tutorials: [{name: "Learn-C.org", url: "https://www.learn-c.org/"}, {
            name: "CS50 (Harvard)",
            url: "https://cs50.harvard.edu/"
        }, {name: "Beej's Guide to C", url: "https://beej.us/guide/bgc/"}, {
            name: "C Programming — Wikibooks",
            url: "https://en.wikibooks.org/wiki/C_Programming"
        }, {"name": "DevDocs C Reference", "url": "https://devdocs.io/c/"}, {
            "name": "Exercism C Track",
            "url": "https://exercism.org/tracks/c"
        }],
        frameworks: [],
        tools: [{name: "CMake", url: "https://cmake.org/", desc: "Build system"}],
        packages: [{name: "GLib", url: "https://docs.gtk.org/glib/", desc: "Core utility library"}, {
            name: "OpenSSL",
            url: "https://www.openssl.org/",
            desc: "Cryptography & TLS"
        }, {name: "libuv", url: "https://libuv.org/", desc: "Async I/O (Node.js core)"}],
        package_manager: {name: "vcpkg / Conan", url: "https://vcpkg.io/"}
    },

    {
        id: 3, sym: "C+", name: "C++", cat: "systems", year: 1985, paradigm: "Multi-paradigm · OOP",
        desc: "C with classes and much more. Powers Unreal Engine, Chrome, databases, and high-frequency trading. The go-to for performance-critical software.",
        links: {
            official: "https://isocpp.org/",
            wiki: "https://en.wikipedia.org/wiki/C%2B%2B",
            docs: "https://cppreference.com/",
            spec: "https://isocpp.org/std/the-standard",
            playground: "https://godbolt.org/",
            reddit: "https://www.reddit.com/r/cpp/"
        },
        tutorials: [{name: "learncpp.com", url: "https://www.learncpp.com/"}, {
            name: "cppreference.com",
            url: "https://cppreference.com/"
        }, {
            name: "C++ Core Guidelines",
            url: "https://isocpp.github.io/CppCoreGuidelines/"
        }, {name: "Compiler Explorer", url: "https://godbolt.org/"}, {
            "name": "Exercism C++ Track",
            "url": "https://exercism.org/tracks/cpp"
        }, {"name": "HackerRank C++", "url": "https://www.hackerrank.com/domains/cpp"}],
        frameworks: [{name: "Qt", url: "https://www.qt.io/", desc: "Cross-platform GUI & apps"}, {
            name: "Unreal Engine",
            url: "https://www.unrealengine.com/",
            desc: "Game engine"
        }],
        tools: [{name: "LLVM", url: "https://llvm.org/", desc: "Compiler infrastructure"}],
        packages: [{name: "Boost", url: "https://www.boost.org/", desc: "Utility libraries"}, {
            name: "OpenCV",
            url: "https://opencv.org/",
            desc: "Computer vision"
        }],
        package_manager: {name: "vcpkg / Conan", url: "https://vcpkg.io/"}
    },

    {
        id: 4, sym: "Go", name: "Go", cat: "systems", year: 2009, paradigm: "Procedural · Concurrent",
        desc: "Google's opinionated compiled language. Goroutines make concurrency trivial. Powers Docker, Kubernetes, Terraform, and most modern cloud infrastructure.",
        links: {
            official: "https://go.dev/",
            wiki: "https://en.wikipedia.org/wiki/Go_(programming_language)",
            docs: "https://pkg.go.dev/",
            playground: "https://go.dev/play/",
            github: "https://github.com/golang/go",
            spec: "https://go.dev/ref/spec",
            reddit: "https://www.reddit.com/r/golang/"
        },
        tutorials: [{name: "A Tour of Go", url: "https://go.dev/tour/"}, {
            name: "Go by Example",
            url: "https://gobyexample.com/"
        }, {name: "Effective Go", url: "https://go.dev/doc/effective_go"}, {
            name: "Go 101",
            url: "https://go101.org/"
        }, {"name": "Exercism Go Track", "url": "https://exercism.org/tracks/go"}, {
            "name": "GopherCon Talks",
            "url": "https://www.youtube.com/c/GopherAcademy"
        }],
        frameworks: [{name: "Gin", url: "https://gin-gonic.com/", desc: "Fast HTTP framework"}, {
            name: "Echo",
            url: "https://echo.labstack.com/",
            desc: "High performance router"
        }, {name: "Fiber", url: "https://gofiber.io/", desc: "Express-inspired framework"}, {
            name: "Chi",
            url: "https://go-chi.io/",
            desc: "Lightweight router"
        }, {name: "gRPC-Go", url: "https://grpc.io/docs/languages/go/", desc: "RPC framework"}],
        tools: [],
        packages: [],
        package_manager: {name: "Go modules / pkg.go.dev", url: "https://pkg.go.dev/"}
    },

    {
        id: 5, sym: "Rs", name: "Rust", cat: "systems", year: 2010, paradigm: "Systems · Multi-paradigm",
        desc: "Memory safety without garbage collection. Fast as C, safe as high-level languages. Most loved language on Stack Overflow for 9 consecutive years.",
        links: {
            official: "https://www.rust-lang.org/",
            wiki: "https://en.wikipedia.org/wiki/Rust_(programming_language)",
            docs: "https://doc.rust-lang.org/",
            playground: "https://play.rust-lang.org/",
            github: "https://github.com/rust-lang/rust",
            spec: "https://doc.rust-lang.org/reference/",
            reddit: "https://www.reddit.com/r/rust/"
        },
        tutorials: [{name: "The Rust Book", url: "https://doc.rust-lang.org/book/"}, {
            name: "Rustlings",
            url: "https://rustlings.cool/"
        }, {
            name: "Rust by Example",
            url: "https://doc.rust-lang.org/rust-by-example/"
        }, {
            name: "Comprehensive Rust (Google)",
            url: "https://google.github.io/comprehensive-rust/"
        }, {"name": "Exercism Rust Track", "url": "https://exercism.org/tracks/rust"}, {
            "name": "Rustconf Talks",
            "url": "https://www.youtube.com/c/RustVideos"
        }],
        frameworks: [{name: "Actix Web", url: "https://actix.rs/", desc: "Blazing fast web framework"}, {
            name: "Tokio",
            url: "https://tokio.rs/",
            desc: "Async runtime"
        }, {name: "Axum", url: "https://github.com/tokio-rs/axum", desc: "Ergonomic web framework"}, {
            name: "Tauri",
            url: "https://tauri.app/",
            desc: "Desktop apps"
        }, {name: "Bevy", url: "https://bevyengine.org/", desc: "Data-driven game engine"}],
        tools: [],
        packages: [],
        package_manager: {name: "Cargo / crates.io", url: "https://crates.io/"}
    },

    {
        id: 6, sym: "D", name: "D", cat: "systems", year: 2001, paradigm: "Multi-paradigm · Systems",
        desc: "A modernization of C++ with cleaner syntax and better metaprogramming. Combines the power of C++ with the productivity of higher-level languages.",
        links: {
            official: "https://dlang.org/",
            wiki: "https://en.wikipedia.org/wiki/D_(programming_language)",
            docs: "https://dlang.org/documentation.html",
            github: "https://github.com/dlang/dmd",
            playground: "https://run.dlang.io/",
            spec: "https://dlang.org/spec/spec.html",
            reddit: "https://www.reddit.com/r/d_language/"
        },
        tutorials: [{name: "D Tour", url: "https://tour.dlang.org/"}, {
            name: "Programming in D",
            url: "https://ddili.org/ders/d.en/"
        }, {name: "DLang.org Learn", url: "https://dlang.org/learn.html"}, {
            "name": "D Language Foundation",
            "url": "https://dlang.org/"
        }, {"name": "Exercism D Track", "url": "https://exercism.org/tracks/d"}],
        frameworks: [{name: "Vibe.d", url: "https://vibed.org/", desc: "Async I/O web framework"}, {
            name: "Diamond MVC",
            url: "https://diamondmvc.org/",
            desc: "Full-stack web framework"
        }],
        tools: [{name: "DUB", url: "https://code.dlang.org/", desc: "Package manager & build tool"}],
        packages: [],
        package_manager: {name: "DUB / code.dlang.org", url: "https://code.dlang.org/"}
    },

    {
        id: 7, sym: "Ad", name: "Ada", cat: "systems", year: 1980, paradigm: "Procedural · Concurrent",
        desc: "Developed by the US DoD for mission-critical safety. Used in aviation (Airbus), aerospace (space station), rail, and medical devices. Extreme reliability guaranteed.",
        links: {
            official: "https://www.adacore.com/about-ada",
            wiki: "https://en.wikipedia.org/wiki/Ada_(programming_language)",
            docs: "https://learn.adacore.com/",
            spec: "https://ada-auth.org/standards/rm12_w_tc1/html/RM-TOC.html",
            playground: "https://learn.adacore.com/courses/intro-to-ada/",
            github: "https://github.com/AdaCore/gnat-llvm",
            reddit: "https://www.reddit.com/r/ada/"
        },
        tutorials: [{name: "Ada Learn", url: "https://learn.adacore.com/"}, {
            name: "AdaCore University",
            url: "https://university.adacore.com/"
        }, {
            name: "Programming in Ada 2012",
            url: "https://www.cambridge.org/core/books/programming-in-ada-2012/"
        }, {"name": "Ada Rosetta Code", "url": "https://rosettacode.org/wiki/Category:Ada"}, {
            "name": "AdaCore GitHub",
            "url": "https://github.com/AdaCore"
        }],
        frameworks: [{name: "AWS", url: "https://aws.adacore.com/", desc: "Ada Web Services"}],
        tools: [{name: "GNAT", url: "https://www.adacore.com/gnatpro", desc: "GNU Ada compiler"}, {
            name: "Alire",
            url: "https://alire.ada.dev/",
            desc: "Ada package manager"
        }],
        packages: [],
        package_manager: {name: "Alire", url: "https://alire.ada.dev/"}
    },

    {
        id: 8, sym: "Cb", name: "COBOL", cat: "systems", year: 1959, paradigm: "Procedural · Business",
        desc: "Powers global banking and finance. Over 95% of ATM transactions run on COBOL. More COBOL code is written today than ever before — over 800 billion lines exist.",
        links: {
            wiki: "https://en.wikipedia.org/wiki/COBOL",
            docs: "https://www.ibm.com/docs/en/cobol-zos/",
            spec: "https://pubs.opengroup.org/onlinepubs/9699919799/",
            playground: "https://www.jdoodle.com/execute-cobol-online/",
            github: "https://github.com/gnu-cobol/gnucobol",
            reddit: "https://www.reddit.com/r/cobol/"
        },
        tutorials: [{name: "IBM COBOL Course", url: "https://www.ibm.com/docs/en/cobol-zos/"}, {
            name: "OpenCOBOL Guide",
            url: "https://opencobolide.software.informer.com/"
        }, {
            name: "COBOL Programming — Mainframe",
            url: "https://www.tutorialspoint.com/cobol/"
        }, {"name": "OpenCOBOL Tutorial", "url": "https://opencobol.add1tocobol.com/"}, {
            "name": "COBOL on GitHub",
            "url": "https://github.com/openmainframeproject/cobol-programming-course"
        }],
        frameworks: [],
        tools: [{
            name: "GnuCOBOL",
            url: "https://gnucobol.sourceforge.io/",
            desc: "Open-source COBOL compiler"
        }, {
            name: "IBM Enterprise COBOL",
            url: "https://www.ibm.com/products/cobol-compiler-zos",
            desc: "IBM mainframe compiler"
        }, {
            name: "Micro Focus COBOL",
            url: "https://www.microfocus.com/en-us/products/cobol-development-tools/",
            desc: "Enterprise COBOL tools"
        }],
        packages: [],
        package_manager: null
    },

    {
        id: 9, sym: "Fo", name: "Fortran", cat: "systems", year: 1957, paradigm: "Scientific · Procedural",
        desc: "The first high-level language ever created. Still dominant in HPC, climate modeling, weather forecasting, and scientific simulations at NASA, CERN, and national labs.",
        links: {
            official: "https://fortran-lang.org/",
            wiki: "https://en.wikipedia.org/wiki/Fortran",
            docs: "https://fortran-lang.org/learn/",
            github: "https://github.com/fortran-lang/stdlib",
            playground: "https://play.fortran-lang.org/",
            spec: "https://j3-fortran.org/doc/year/24/24-007.pdf",
            reddit: "https://www.reddit.com/r/fortran/"
        },
        tutorials: [{name: "Fortran-Lang Learn", url: "https://fortran-lang.org/learn/"}, {
            name: "Fortran 90 Tutorial",
            url: "https://www.cs.mtu.edu/~shene/COURSES/cs201/NOTES/fortran.html"
        }, {
            name: "Introduction to Fortran",
            url: "https://ourcodingclub.github.io/tutorials/fortran-intro/"
        }, {
            "name": "Exercism Fortran Track",
            "url": "https://exercism.org/tracks/fortran"
        }, {"name": "Rosetta Code Fortran", "url": "https://rosettacode.org/wiki/Category:Fortran"}],
        frameworks: [],
        tools: [],
        packages: [{
            name: "LAPACK",
            url: "https://www.netlib.org/lapack/",
            desc: "Linear algebra library"
        }, {name: "MPI", url: "https://www.mpi-forum.org/", desc: "Parallel computing interface"}, {
            name: "OpenMP",
            url: "https://www.openmp.org/",
            desc: "Shared memory parallelism"
        }, {name: "stdlib", url: "https://github.com/fortran-lang/stdlib", desc: "Fortran Standard Library"}],
        package_manager: {name: "fpm (Fortran Package Manager)", url: "https://fpm.fortran-lang.org/"}
    },

    {
        id: 10, sym: "Zg", name: "Zig", cat: "systems", year: 2016, paradigm: "Systems · Imperative",
        desc: "A modern C replacement. No hidden control flow, no hidden allocations. Comptime instead of macros. Cross-compiles to anything and can compile C/C++ too.",
        links: {
            official: "https://ziglang.org/",
            wiki: "https://en.wikipedia.org/wiki/Zig_(programming_language)",
            docs: "https://ziglang.org/documentation/master/",
            github: "https://github.com/ziglang/zig",
            playground: "https://zig-play.dev/",
            spec: "https://ziglang.org/documentation/master/",
            reddit: "https://www.reddit.com/r/Zig/"
        },
        tutorials: [{name: "Zig Learn", url: "https://zig.guide/"}, {
            name: "ziglearn.org",
            url: "https://ziglearn.org/"
        }, {name: "Zig Documentation", url: "https://ziglang.org/documentation/master/"}, {
            name: "Ziglings",
            url: "https://codeberg.org/ziglings/exercises/"
        }, {"name": "Zig News", "url": "https://zig.news/"}, {
            "name": "Zig Show",
            "url": "https://www.youtube.com/@ZigSHOWtime"
        }],
        frameworks: [{
            name: "Zap",
            url: "https://github.com/zigzap/zap",
            desc: "Blazing fast web framework"
        }, {name: "mach", url: "https://machengine.org/", desc: "Game engine & graphics"}, {
            name: "zig-gamedev",
            url: "https://github.com/michal-z/zig-gamedev",
            desc: "Game development libs"
        }],
        tools: [],
        packages: [],
        package_manager: {
            name: "Zig Package Manager (built-in)",
            url: "https://ziglang.org/documentation/master/#Zig-Build-System"
        }
    },

    {
        id: 11, sym: "Ni", name: "Nim", cat: "systems", year: 2008, paradigm: "Multi-paradigm · Compiled",
        desc: "Python-like syntax that compiles to C, C++, or JavaScript. Efficient and expressive with powerful metaprogramming via macros. Garbage collected but GC-free mode available.",
        links: {
            official: "https://nim-lang.org/",
            wiki: "https://en.wikipedia.org/wiki/Nim_(programming_language)",
            docs: "https://nim-lang.org/documentation.html",
            github: "https://github.com/nim-lang/Nim",
            playground: "https://play.nim-lang.org/",
            spec: "https://nim-lang.org/docs/manual.html",
            reddit: "https://www.reddit.com/r/nim/"
        },
        tutorials: [{name: "Nim Tutorial", url: "https://nim-lang.org/docs/tut1.html"}, {
            name: "Nim by Example",
            url: "https://nim-by-example.github.io/"
        }, {name: "Nimbus Road (book)", url: "https://narimiran.github.io/nim-basics/"}, {
            "name": "Exercism Nim Track",
            "url": "https://exercism.org/tracks/nim"
        }, {"name": "Rosetta Code Nim", "url": "https://rosettacode.org/wiki/Category:Nim"}],
        frameworks: [{
            name: "Jester",
            url: "https://github.com/dom96/jester",
            desc: "Micro web framework"
        }, {name: "Prologue", url: "https://github.com/planety/prologue", desc: "Full-stack web framework"}],
        tools: [{name: "Nimble", url: "https://github.com/nim-lang/nimble", desc: "Package manager"}],
        packages: [],
        package_manager: {name: "Nimble", url: "https://github.com/nim-lang/nimble"}
    },

    {
        id: 12, sym: "Cr", name: "Crystal", cat: "systems", year: 2014, paradigm: "OOP · Compiled",
        desc: "Ruby-like syntax, C-like speed. Statically typed with type inference. The fast alternative to Ruby — same expressiveness, 100x faster performance.",
        links: {
            official: "https://crystal-lang.org/",
            wiki: "https://en.wikipedia.org/wiki/Crystal_(programming_language)",
            docs: "https://crystal-lang.org/reference/",
            github: "https://github.com/crystal-lang/crystal",
            playground: "https://play.crystal-lang.org/",
            spec: "https://crystal-lang.org/reference/master/syntax_and_semantics/",
            reddit: "https://www.reddit.com/r/crystal_programming/"
        },
        tutorials: [{name: "Crystal Docs", url: "https://crystal-lang.org/docs/"}, {
            name: "Official Tutorial",
            url: "https://crystal-lang.org/reference/getting_started/"
        }, {
            name: "Crystal for Rubyists",
            url: "https://www.crystalforrubyists.com/"
        }, {"name": "Exercism Crystal Track", "url": "https://exercism.org/tracks/crystal"}, {
            "name": "Crystal Shards",
            "url": "https://crystalshards.org/"
        }],
        frameworks: [{
            name: "Lucky",
            url: "https://luckyframework.org/",
            desc: "Full-stack web framework"
        }, {name: "Kemal", url: "https://kemalcr.com/", desc: "Fast web framework"}, {
            name: "Amber",
            url: "https://amberframework.org/",
            desc: "Web application framework"
        }],
        tools: [],
        packages: [],
        package_manager: {name: "Shards", url: "https://shards.info/"}
    },

    {
        id: 13, sym: "Pa", name: "Pascal", cat: "systems", year: 1970, paradigm: "Procedural · Teaching",
        desc: "Wirth's structured teaching language. Influenced Delphi, Modula, Ada, and Oberon. Still used in competitive programming and teaches structured programming principles.",
        links: {
            wiki: "https://en.wikipedia.org/wiki/Pascal_(programming_language)",
            docs: "https://www.freepascal.org/docs.html",
            playground: "https://www.jdoodle.com/execute-pascal-online/",
            github: "https://github.com/fpc/FPCSource",
            reddit: "https://www.reddit.com/r/pascal/"
        },
        tutorials: [{
            name: "Free Pascal Tutorial",
            url: "https://www.freepascal.org/tutorial.html"
        }, {name: "Pascal Programming", url: "https://www.tutorialspoint.com/pascal/"}, {
            name: "Lazarus IDE Guide",
            url: "https://wiki.lazarus.freepascal.org/"
        }, {
            "name": "Wikibooks Pascal",
            "url": "https://en.wikibooks.org/wiki/Pascal_Programming"
        }, {"name": "Lazarus Getting Started", "url": "https://wiki.lazarus.freepascal.org/Getting_Started"}],
        frameworks: [],
        tools: [{
            name: "Free Pascal",
            url: "https://www.freepascal.org/",
            desc: "Open-source Pascal compiler"
        }, {
            name: "Lazarus",
            url: "https://www.lazarus-ide.org/",
            desc: "Delphi-like IDE & framework"
        }, {
            name: "Turbo Pascal",
            url: "https://en.wikipedia.org/wiki/Turbo_Pascal",
            desc: "Historic Borland compiler"
        }],
        packages: [],
        package_manager: {name: "OPM (Online Package Manager)", url: "https://packages.lazarus-ide.org/"}
    },

    {
        id: 14, sym: "Al", name: "ALGOL", cat: "systems", year: 1958, paradigm: "Procedural · Imperative",
        desc: "Ancestor of Pascal, C, and most modern languages. Introduced block structure, lexical scope, BNF notation, and the concept of structured programming itself.",
        links: {
            wiki: "https://en.wikipedia.org/wiki/ALGOL",
            docs: "https://www.softwarepreservationnetwork.org/",
            playground: "https://www.jdoodle.com/execute-algol-68-online/"
        },
        tutorials: [{name: "ALGOL Wikipedia", url: "https://en.wikipedia.org/wiki/ALGOL"}, {
            name: "History of ALGOL",
            url: "https://www.computerhistory.org/collections/catalog/102784826"
        }, {"name": "ALGOL 68 Reference", "url": "https://jmvdveer.home.xs4all.nl/en.algol-68-revised-report.html"}],
        frameworks: [],
        tools: [],
        packages: [],
        package_manager: null
    },

    {
        id: 15, sym: "Va", name: "Vala", cat: "systems", year: 2006, paradigm: "OOP · GObject",
        desc: "C# syntax that compiles to C, targeting GLib/GObject. GNOME's preferred application language for building desktop Linux apps with modern syntax.",
        links: {
            official: "https://vala.dev/",
            wiki: "https://en.wikipedia.org/wiki/Vala_(programming_language)",
            docs: "https://valadoc.org/",
            github: "https://gitlab.gnome.org/GNOME/vala",
            playground: "https://gitlab.gnome.org/GNOME/vala",
            reddit: "https://www.reddit.com/r/gnome/"
        },
        tutorials: [{
            name: "GNOME Vala Tutorial",
            url: "https://wiki.gnome.org/Projects/Vala/Tutorial"
        }, {name: "Vala Documentation", url: "https://valadoc.org/"}, {
            name: "GNOME Developer",
            url: "https://developer.gnome.org/"
        }, {"name": "Valadoc.org", "url": "https://valadoc.org/"}, {
            "name": "GNOME Vala Examples",
            "url": "https://gitlab.gnome.org/GNOME/vala/tree/main/tests"
        }],
        frameworks: [{name: "GTK4", url: "https://gtk.org/", desc: "GNOME widget toolkit"}, {
            name: "libadwaita",
            url: "https://gnome.pages.gitlab.gnome.org/libadwaita/",
            desc: "GNOME UI components"
        }, {name: "Granite", url: "https://github.com/elementary/granite", desc: "elementary OS framework"}],
        tools: [],
        packages: [],
        package_manager: null
    },

    {
        id: 16, sym: "Ft", name: "Forth", cat: "systems", year: 1970, paradigm: "Stack-based · Concatenative",
        desc: "Extremely lightweight stack-based language used in boot loaders, embedded firmware, and BIOS. Open Firmware (used in Apple Macs and SPARC) is written in Forth.",
        links: {
            wiki: "https://en.wikipedia.org/wiki/Forth_(programming_language)",
            docs: "https://forth.com/starting-forth/",
            official: "https://www.forth.org/",
            playground: "https://skilldrick.github.io/easyforth/",
            github: "https://github.com/nimblemachines/muforth",
            reddit: "https://www.reddit.com/r/Forth/"
        },
        tutorials: [{name: "Starting Forth", url: "https://www.forth.com/starting-forth/"}, {
            name: "Thinking Forth",
            url: "http://thinking-forth.sourceforge.net/"
        }, {name: "Easy Forth", url: "https://skilldrick.github.io/easyforth/"}, {
            "name": "Rosetta Code Forth",
            "url": "https://rosettacode.org/wiki/Category:Forth"
        }, {"name": "Forth 2012 Standard", "url": "https://forth-standard.org/"}],
        frameworks: [{
            name: "gForth",
            url: "https://www.gnu.org/software/gforth/",
            desc: "GNU Forth implementation"
        }, {
            name: "SwiftForth",
            url: "https://www.forth.com/swiftforth/",
            desc: "Commercial Forth system"
        }, {name: "Open Firmware", url: "https://en.wikipedia.org/wiki/Open_Firmware", desc: "Boot firmware standard"}],
        tools: [],
        packages: [],
        package_manager: null
    },

    {
        id: 17, sym: "Cn", name: "Carbon", cat: "systems", year: 2022, paradigm: "Systems · C++ successor",
        desc: "Google's experimental C++ successor with direct C++ interoperability and cleaner syntax. Aims to be to C++ what TypeScript is to JavaScript.",
        links: {
            official: "https://github.com/carbon-language/carbon-lang",
            wiki: "https://en.wikipedia.org/wiki/Carbon_(programming_language)",
            docs: "https://github.com/carbon-language/carbon-lang/tree/trunk/docs",
            github: "https://github.com/carbon-language/carbon-lang",
            reddit: "https://www.reddit.com/r/carbonlang/"
        },
        tutorials: [{
            name: "Carbon GitHub",
            url: "https://github.com/carbon-language/carbon-lang"
        }, {
            name: "Carbon Docs",
            url: "https://github.com/carbon-language/carbon-lang/tree/trunk/docs"
        }, {
            name: "CppNorth Talk",
            url: "https://www.youtube.com/watch?v=omrY53kbVoA"
        }, {
            "name": "Carbon Design Decisions",
            "url": "https://github.com/carbon-language/carbon-lang/tree/trunk/docs/design"
        }],
        frameworks: [],
        tools: [],
        packages: [],
        package_manager: null
    },

    {
        id: 18, sym: "Od", name: "Odin", cat: "systems", year: 2016, paradigm: "Procedural · Systems",
        desc: "Designed as a better C. Data-oriented design, no hidden allocations, explicit control. Growing rapidly in game development and graphics programming.",
        links: {
            official: "https://odin-lang.org/",
            wiki: "https://en.wikipedia.org/wiki/Odin_(programming_language)",
            docs: "https://pkg.odin-lang.org/",
            github: "https://github.com/odin-lang/Odin",
            playground: "https://pkg.odin-lang.org/",
            reddit: "https://www.reddit.com/r/odinlang/"
        },
        tutorials: [{name: "Odin Overview", url: "https://odin-lang.org/docs/overview/"}, {
            name: "Odin GitHub Examples",
            url: "https://github.com/odin-lang/Odin/tree/master/examples"
        }, {name: "Karl Zylinski's Blog", url: "https://zylinski.se/"}, {
            "name": "Odin Package Docs",
            "url": "https://pkg.odin-lang.org/"
        }, {"name": "Odin Discord", "url": "https://discord.gg/sVBPHEv"}],
        frameworks: [],
        tools: [],
        packages: [{
            name: "Raylib-Odin",
            url: "https://github.com/Skytrias/raylib-odin",
            desc: "Game development"
        }, {name: "Vendor libs", url: "https://pkg.odin-lang.org/vendor/", desc: "Official vendor bindings"}],
        package_manager: null
    },

    {
        id: 19, sym: "Ob", name: "Oberon", cat: "systems", year: 1987, paradigm: "Procedural · OOP",
        desc: "Wirth's final language. Clean, simple, and safe. Ancestor of Go's design philosophy. Component Pascal and Active Oberon are modern successors.",
        links: {
            wiki: "https://en.wikipedia.org/wiki/Oberon_(programming_language)",
            docs: "https://people.inf.ethz.ch/wirth/Oberon/"
        },
        tutorials: [{
            name: "Oberon Report",
            url: "https://people.inf.ethz.ch/wirth/Oberon/OberRep.pdf"
        }, {name: "Project Oberon", url: "https://people.inf.ethz.ch/wirth/ProjectOberon/"}],
        frameworks: [],
        tools: [{
            name: "Project Oberon",
            url: "https://people.inf.ethz.ch/wirth/ProjectOberon/",
            desc: "Complete OS in Oberon"
        }, {name: "A2 (Bluebottle)", url: "https://gitlab.inf.ethz.ch/felixf/oberon", desc: "Modern Oberon system"}],
        packages: [],
        package_manager: null
    },

    {
        id: 20, sym: "M2", name: "Modula-2", cat: "systems", year: 1978, paradigm: "Procedural · Modular",
        desc: "Wirth's successor to Pascal. Introduced proper module systems and coroutines. Hugely influential on Ada, Oberon, and later Go's package system.",
        links: {wiki: "https://en.wikipedia.org/wiki/Modula-2", docs: "https://www.modula2.org/"},
        tutorials: [{name: "Modula-2 Tutorial", url: "https://www.modula2.org/"}, {
            name: "ETH Zurich Notes",
            url: "https://people.inf.ethz.ch/wirth/Modula-2/"
        }],
        frameworks: [],
        tools: [{name: "GNU Modula-2", url: "https://www.nongnu.org/gm2/", desc: "GCC Modula-2 compiler"}],
        packages: [],
        package_manager: null
    },

    // ── SCRIPTING ────────────────────────────────────────────────────
    {
        id: 21, sym: "Py", name: "Python", cat: "scripting", year: 1991, paradigm: "Multi-paradigm · General",
        desc: "The world's most popular language. Dominates AI/ML, data science, web backends, and automation. Famously readable and beginner-friendly.",
        links: {
            official: "https://www.python.org/",
            wiki: "https://en.wikipedia.org/wiki/Python_(programming_language)",
            docs: "https://docs.python.org/3/",
            playground: "https://www.python.org/shell/",
            github: "https://github.com/python/cpython",
            spec: "https://docs.python.org/3/reference/",
            reddit: "https://www.reddit.com/r/Python/"
        },
        tutorials: [{name: "Official Tutorial", url: "https://docs.python.org/3/tutorial/"}, {
            name: "Real Python",
            url: "https://realpython.com/"
        }, {name: "Python for Everybody", url: "https://www.py4e.com/"}, {
            name: "Automate the Boring Stuff",
            url: "https://automatetheboringstuff.com/"
        }, {"name": "Exercism Python Track", "url": "https://exercism.org/tracks/python"}, {
            "name": "Full Stack Python",
            "url": "https://www.fullstackpython.com/"
        }],
        frameworks: [{
            name: "Django",
            url: "https://www.djangoproject.com/",
            desc: "Full-stack web framework"
        }, {name: "FastAPI", url: "https://fastapi.tiangolo.com/", desc: "Modern async REST APIs"}, {
            name: "Flask",
            url: "https://flask.palletsprojects.com/",
            desc: "Micro web framework"
        }],
        tools: [],
        packages: [{name: "PyTorch", url: "https://pytorch.org/", desc: "Deep learning"}, {
            name: "Pandas",
            url: "https://pandas.pydata.org/",
            desc: "Data analysis"
        }],
        package_manager: {name: "pip / PyPI", url: "https://pypi.org/"}
    },

    {
        id: 22, sym: "Rb", name: "Ruby", cat: "scripting", year: 1995, paradigm: "OOP · Scripting",
        desc: "Designed for developer happiness. Everything is an object. Rails revolutionized web development and influenced a generation of frameworks.",
        links: {
            official: "https://www.ruby-lang.org/",
            wiki: "https://en.wikipedia.org/wiki/Ruby_(programming_language)",
            docs: "https://ruby-doc.org/",
            playground: "https://try.ruby-lang.org/",
            github: "https://github.com/ruby/ruby",
            spec: "https://ruby-doc.org/docs/ruby-doc-bundle/Manual/man-1.4/syntax.html",
            reddit: "https://www.reddit.com/r/ruby/"
        },
        tutorials: [{name: "The Odin Project", url: "https://www.theodinproject.com/"}, {
            name: "Ruby Koans",
            url: "https://www.rubykoans.com/"
        }, {name: "GoRails", url: "https://gorails.com/"}, {
            name: "Ruby Monk",
            url: "https://rubymonk.com/"
        }, {"name": "Exercism Ruby Track", "url": "https://exercism.org/tracks/ruby"}, {
            "name": "RubyDoc.info",
            "url": "https://www.rubydoc.info/"
        }],
        frameworks: [{
            name: "Ruby on Rails",
            url: "https://rubyonrails.org/",
            desc: "Full-stack web framework"
        }, {name: "Sinatra", url: "https://sinatrarb.com/", desc: "Minimal web DSL"}, {
            name: "Hanami",
            url: "https://hanamirb.org/",
            desc: "Modern web framework"
        }],
        tools: [{name: "RSpec", url: "https://rspec.info/", desc: "Testing framework"}],
        packages: [],
        package_manager: {name: "RubyGems / Bundler", url: "https://rubygems.org/"}
    },

    {
        id: 23, sym: "Pe", name: "Perl", cat: "scripting", year: 1987, paradigm: "Scripting · Text processing",
        desc: "Text processing powerhouse with legendary regex support. Beloved in bioinformatics, sysadmin, and web CGI. CPAN has one of the largest module archives.",
        links: {
            official: "https://www.perl.org/",
            wiki: "https://en.wikipedia.org/wiki/Perl",
            docs: "https://perldoc.perl.org/",
            github: "https://github.com/Perl/perl5",
            playground: "https://perlbanjo.com/",
            reddit: "https://www.reddit.com/r/perl/"
        },
        tutorials: [{name: "Learn Perl", url: "https://learn.perl.org/"}, {
            name: "Perldoc",
            url: "https://perldoc.perl.org/"
        }, {
            name: "Modern Perl (free book)",
            url: "https://modernperlbooks.com/books/modern_perl_2016/"
        }, {"name": "Exercism Perl Track", "url": "https://exercism.org/tracks/perl5"}, {
            "name": "Perl Weekly",
            "url": "https://perlweekly.com/"
        }],
        frameworks: [{
            name: "Mojolicious",
            url: "https://www.mojolicious.org/",
            desc: "Real-time web framework"
        }, {
            name: "Dancer2",
            url: "https://metacpan.org/pod/Dancer2",
            desc: "Lightweight web framework"
        }, {name: "Catalyst", url: "http://www.catalystframework.org/", desc: "MVC web framework"}],
        tools: [],
        packages: [],
        package_manager: {name: "CPAN / cpanm", url: "https://www.cpan.org/"}
    },

    {
        id: 24, sym: "Lu", name: "Lua", cat: "scripting", year: 1993, paradigm: "Scripting · Embeddable",
        desc: "Lightweight, fast, embeddable scripting from Brazil. Powers WoW addons, Roblox, Redis scripting, Nginx (OpenResty), and game engines like Love2D.",
        links: {
            official: "https://www.lua.org/",
            wiki: "https://en.wikipedia.org/wiki/Lua_(programming_language)",
            docs: "https://www.lua.org/manual/5.4/",
            github: "https://github.com/lua/lua",
            playground: "https://www.lua.org/demo.html",
            spec: "https://www.lua.org/manual/5.4/",
            reddit: "https://www.reddit.com/r/lua/"
        },
        tutorials: [{name: "Programming in Lua", url: "https://www.lua.org/pil/"}, {
            name: "Lua Tutorial",
            url: "https://www.tutorialspoint.com/lua/"
        }, {
            name: "Learn Lua in 15 Minutes",
            url: "https://tylerneylon.com/a/learn-lua/"
        }, {"name": "Exercism Lua Track", "url": "https://exercism.org/tracks/lua"}, {
            "name": "Lua Users Wiki",
            "url": "http://lua-users.org/wiki/"
        }],
        frameworks: [{name: "LÖVE 2D", url: "https://love2d.org/", desc: "2D game framework"}, {
            name: "OpenResty",
            url: "https://openresty.org/",
            desc: "Nginx + Lua web platform"
        }, {name: "Lapis", url: "https://leafo.net/lapis/", desc: "Web framework for OpenResty"}],
        tools: [{name: "Busted", url: "https://lunarmodules.github.io/busted/", desc: "Testing framework"}],
        packages: [],
        package_manager: {name: "LuaRocks", url: "https://luarocks.org/"}
    },

    {
        id: 25, sym: "Js", name: "JavaScript", cat: "scripting", year: 1995, paradigm: "Multi-paradigm · Event-driven",
        desc: "The language of the web. Runs in every browser, on servers via Node.js, on mobile via React Native, and on edge runtimes like Deno and Cloudflare Workers.",
        links: {
            official: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
            wiki: "https://en.wikipedia.org/wiki/JavaScript",
            docs: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
            playground: "https://jsfiddle.net/",
            github: "https://github.com/nicowillis/javascript",
            spec: "https://tc39.es/ecma262/",
            reddit: "https://www.reddit.com/r/javascript/"
        },
        tutorials: [{
            name: "MDN Web Docs",
            url: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript"
        }, {name: "javascript.info", url: "https://javascript.info/"}, {
            name: "freeCodeCamp",
            url: "https://www.freecodecamp.org/"
        }, {name: "The Odin Project", url: "https://www.theodinproject.com/"}, {
            "name": "Exercism JS Track",
            "url": "https://exercism.org/tracks/javascript"
        }, {"name": "JSRobot", "url": "https://lab.reaal.me/jsrobot/"}, {
            "name": "33 JS Concepts",
            "url": "https://github.com/leonardomso/33-js-concepts"
        }],
        frameworks: [{name: "React", url: "https://react.dev/", desc: "UI component library"}, {
            name: "Next.js",
            url: "https://nextjs.org/",
            desc: "Full-stack React framework"
        }, {name: "Vue.js", url: "https://vuejs.org/", desc: "Progressive UI framework"}, {
            name: "Svelte",
            url: "https://svelte.dev/",
            desc: "Compiler-based UI framework"
        }],
        tools: [{name: "Node.js", url: "https://nodejs.org/", desc: "Server-side runtime"}],
        packages: [],
        package_manager: {name: "npm / yarn / pnpm", url: "https://www.npmjs.com/"}
    },

    {
        id: 26, sym: "Ts", name: "TypeScript", cat: "scripting", year: 2012, paradigm: "Typed Superset of JS",
        desc: "JavaScript with static types. Catches entire classes of bugs at compile time. Essentially mandatory for large-scale JavaScript. Powers VS Code internals.",
        links: {
            official: "https://www.typescriptlang.org/",
            wiki: "https://en.wikipedia.org/wiki/TypeScript",
            docs: "https://www.typescriptlang.org/docs/",
            playground: "https://www.typescriptlang.org/play",
            github: "https://github.com/microsoft/TypeScript",
            spec: "https://tc39.es/ecma262/",
            reddit: "https://www.reddit.com/r/typescript/"
        },
        tutorials: [{
            name: "Official Handbook",
            url: "https://www.typescriptlang.org/docs/handbook/"
        }, {name: "Total TypeScript", url: "https://www.totaltypescript.com/"}, {
            name: "Execute Program",
            url: "https://www.executeprogram.com/courses/typescript"
        }, {
            name: "TypeScript Deep Dive",
            url: "https://basarat.gitbook.io/typescript/"
        }, {"name": "Exercism TypeScript Track", "url": "https://exercism.org/tracks/typescript"}, {
            "name": "TypeHero",
            "url": "https://typehero.dev/"
        }, {"name": "Type Challenges", "url": "https://github.com/type-challenges/type-challenges"}],
        frameworks: [{name: "Next.js", url: "https://nextjs.org/", desc: "Full-stack with TS support"}, {
            name: "NestJS",
            url: "https://nestjs.com/",
            desc: "Enterprise Node.js framework"
        }],
        tools: [],
        packages: [{name: "tRPC", url: "https://trpc.io/", desc: "End-to-end type safety"}, {
            name: "Prisma",
            url: "https://www.prisma.io/",
            desc: "Type-safe ORM"
        }],
        package_manager: {name: "npm", url: "https://www.npmjs.com/"}
    },

    {
        id: 27, sym: "Ph", name: "PHP", cat: "scripting", year: 1994, paradigm: "Server-side scripting",
        desc: "Powers ~77% of all websites including WordPress, Wikipedia, and Facebook. Laravel turned it into a modern, elegant language loved by developers.",
        links: {
            official: "https://www.php.net/",
            wiki: "https://en.wikipedia.org/wiki/PHP",
            docs: "https://www.php.net/manual/",
            playground: "https://3v4l.org/",
            github: "https://github.com/php/php-src",
            spec: "https://www.php.net/manual/en/langref.php",
            reddit: "https://www.reddit.com/r/PHP/"
        },
        tutorials: [{
            name: "PHP.net Manual",
            url: "https://www.php.net/manual/en/getting-started.php"
        }, {name: "Laracasts", url: "https://laracasts.com/"}, {
            name: "PHP The Right Way",
            url: "https://phptherightway.com/"
        }, {name: "W3Schools PHP", url: "https://www.w3schools.com/php/"}, {
            "name": "Exercism PHP Track",
            "url": "https://exercism.org/tracks/php"
        }, {"name": "PHP: The Right Way", "url": "https://phptherightway.com/"}],
        frameworks: [{
            name: "Laravel",
            url: "https://laravel.com/",
            desc: "Elegant full-stack framework"
        }, {name: "Symfony", url: "https://symfony.com/", desc: "Enterprise components"}, {
            name: "WordPress",
            url: "https://wordpress.org/",
            desc: "CMS powering 43% of the web"
        }, {name: "Filament", url: "https://filamentphp.com/", desc: "Admin panel & TALL stack"}],
        tools: [],
        packages: [],
        package_manager: {name: "Composer / Packagist", url: "https://packagist.org/"}
    },

    {
        id: 28, sym: "Bh", name: "Bash", cat: "scripting", year: 1989, paradigm: "Scripting · Shell",
        desc: "The GNU shell and default on most Linux distros. Essential for DevOps, CI/CD pipelines, system automation, Docker, and sysadmin work.",
        links: {
            official: "https://www.gnu.org/software/bash/",
            wiki: "https://en.wikipedia.org/wiki/Bash_(Unix_shell)",
            docs: "https://www.gnu.org/software/bash/manual/",
            spec: "https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html",
            playground: "https://www.jdoodle.com/test-bash-script-online/",
            github: "https://git.savannah.gnu.org/cgit/bash.git",
            reddit: "https://www.reddit.com/r/bash/"
        },
        tutorials: [{name: "The Bash Academy", url: "https://www.bash.academy/"}, {
            name: "Bash Scripting Tutorial",
            url: "https://ryanstutorials.net/bash-scripting-tutorial/"
        }, {name: "Advanced Bash Scripting", url: "https://tldp.org/LDP/abs/html/"}, {
            name: "shellcheck.net",
            url: "https://www.shellcheck.net/"
        }, {"name": "Exercism Bash Track", "url": "https://exercism.org/tracks/bash"}, {
            "name": "Bash Cheatsheet",
            "url": "https://devhints.io/bash"
        }],
        frameworks: [{name: "Oh My Bash", url: "https://ohmybash.nntoan.com/", desc: "Bash framework & themes"}],
        tools: [{name: "ShellCheck", url: "https://www.shellcheck.net/", desc: "Shell script linter"}, {
            name: "Bats",
            url: "https://bats-core.readthedocs.io/",
            desc: "Bash Automated Testing System"
        }],
        packages: [],
        package_manager: null
    },

    {
        id: 29, sym: "Pw", name: "PowerShell", cat: "scripting", year: 2006, paradigm: "Scripting · OOP Shell",
        desc: "Microsoft's task automation framework built on .NET. Works with .NET objects instead of plain text. Cross-platform since v6. Essential for Windows admin and Azure DevOps.",
        links: {
            official: "https://learn.microsoft.com/en-us/powershell/",
            wiki: "https://en.wikipedia.org/wiki/PowerShell",
            docs: "https://learn.microsoft.com/en-us/powershell/scripting/overview",
            github: "https://github.com/PowerShell/PowerShell",
            playground: "https://shell.azure.com/",
            spec: "https://learn.microsoft.com/en-us/powershell/scripting/lang-spec/chapter-01",
            reddit: "https://www.reddit.com/r/PowerShell/"
        },
        tutorials: [{
            name: "PS101",
            url: "https://learn.microsoft.com/en-us/powershell/scripting/learn/ps101/00-introduction"
        }, {name: "PowerShell Docs", url: "https://learn.microsoft.com/en-us/powershell/"}, {
            name: "SS64 Reference",
            url: "https://ss64.com/ps/"
        }, {
            "name": "Exercism PowerShell Track",
            "url": "https://exercism.org/tracks/powershell"
        }, {"name": "PowerShell Gallery", "url": "https://www.powershellgallery.com/"}],
        frameworks: [],
        tools: [{name: "Pester", url: "https://pester.dev/", desc: "Testing framework"}],
        packages: [{
            name: "PSReadLine",
            url: "https://github.com/PowerShell/PSReadLine",
            desc: "Readline for PowerShell"
        }, {
            name: "Az PowerShell",
            url: "https://learn.microsoft.com/en-us/powershell/azure/",
            desc: "Azure automation"
        }],
        package_manager: {name: "PowerShell Gallery", url: "https://www.powershellgallery.com/"}
    },

    {
        id: 30, sym: "Aw", name: "AWK", cat: "scripting", year: 1977, paradigm: "Pattern scanning",
        desc: "Pattern scanning and text processing built into Unix. Extraordinarily powerful for log processing, data extraction, and ETL pipelines. Named after Aho, Weinberger, Kernighan.",
        links: {
            wiki: "https://en.wikipedia.org/wiki/AWK",
            docs: "https://www.gnu.org/software/gawk/manual/",
            spec: "https://pubs.opengroup.org/onlinepubs/9699919799/utilities/awk.html",
            playground: "https://awk.js.org/",
            github: "https://github.com/onetrueawk/awk",
            reddit: "https://www.reddit.com/r/commandline/"
        },
        tutorials: [{name: "Grymoire AWK", url: "https://www.grymoire.com/Unix/Awk.html"}, {
            name: "AWK Tutorial",
            url: "https://www.tutorialspoint.com/awk/"
        }, {name: "The AWK Programming Language (book)", url: "https://awk.dev/"}, {
            "name": "AWK in 20 minutes",
            "url": "https://ferd.ca/awk-in-20-minutes.html"
        }, {"name": "AWK Cheatsheet", "url": "https://devhints.io/awk"}],
        frameworks: [],
        tools: [{
            name: "gawk",
            url: "https://www.gnu.org/software/gawk/",
            desc: "GNU AWK implementation"
        }, {name: "mawk", url: "https://invisible-island.net/mawk/", desc: "Fast AWK interpreter"}],
        packages: [],
        package_manager: null
    },

    {
        id: 31, sym: "Gr", name: "Groovy", cat: "scripting", year: 2003, paradigm: "OOP · Dynamic JVM",
        desc: "Dynamic JVM language with optional typing. Powers Jenkins CI/CD pipelines and Gradle build scripts. Concise, expressive, and interoperable with Java.",
        links: {
            official: "https://groovy-lang.org/",
            wiki: "https://en.wikipedia.org/wiki/Apache_Groovy",
            docs: "https://groovy-lang.org/documentation.html",
            github: "https://github.com/apache/groovy",
            playground: "https://groovyconsole.appspot.com/",
            spec: "https://groovy-lang.org/documentation.html#languagespecification",
            reddit: "https://www.reddit.com/r/groovy/"
        },
        tutorials: [{name: "Groovy Learn", url: "https://groovy-lang.org/learn.html"}, {
            name: "Gradle Groovy DSL",
            url: "https://docs.gradle.org/current/dsl/"
        }, {name: "Groovy Playground", url: "https://groovyconsole.appspot.com/"}, {
            "name": "Exercism Groovy Track",
            "url": "https://exercism.org/tracks/groovy"
        }, {"name": "Groovy Cheatsheet", "url": "https://devhints.io/groovy"}],
        frameworks: [{name: "Grails", url: "https://grails.org/", desc: "Full-stack web framework"}],
        tools: [{name: "Spock", url: "https://spockframework.org/", desc: "Testing framework"}, {
            name: "Gradle",
            url: "https://gradle.org/",
            desc: "Build automation"
        }],
        packages: [],
        package_manager: {name: "Maven / Gradle", url: "https://gradle.org/"}
    },

    {
        id: 32, sym: "Tc", name: "Tcl", cat: "scripting", year: 1988, paradigm: "Scripting · Everything-string",
        desc: "Everything is a string. Used in EDA tools (Cadence, Synopsys), network automation (Cisco IOS), and embedded test frameworks. Tk made it the first popular GUI toolkit.",
        links: {
            wiki: "https://en.wikipedia.org/wiki/Tcl",
            docs: "https://www.tcl.tk/man/tcl8.6/",
            official: "https://www.tcl.tk/",
            playground: "https://www.tutorialspoint.com/execute_tcl_online.php",
            reddit: "https://www.reddit.com/r/Tcl/"
        },
        tutorials: [{
            name: "Tcl Tutorial",
            url: "https://www.tcl.tk/man/tcl8.5/tutorial/Tcl0.html"
        }, {name: "Tcl/Tk Book", url: "https://www.beedub.com/book/"}, {
            name: "TclTutor",
            url: "http://www.msen.com/~clif/TclTutor.html"
        }, {"name": "Tcler's Wiki", "url": "https://wiki.tcl-lang.org/"}, {
            "name": "Rosetta Code Tcl",
            "url": "https://rosettacode.org/wiki/Category:Tcl"
        }],
        frameworks: [{
            name: "Tk",
            url: "https://www.tcl.tk/software/tcltk/",
            desc: "Cross-platform GUI toolkit"
        }, {name: "expect", url: "https://core.tcl-lang.org/expect/index", desc: "Interactive process automation"}],
        tools: [],
        packages: [],
        package_manager: {name: "Teapot / teacup", url: "https://www.activestate.com/products/tcl/"}
    },

    {
        id: 33, sym: "Ac", name: "ActionScript", cat: "scripting", year: 1998, paradigm: "OOP · Event-driven",
        desc: "ECMAScript-based scripting for Adobe Flash. Powered an entire era of web animations, games, and interactive content before HTML5 replaced Flash in 2020.",
        links: {
            wiki: "https://en.wikipedia.org/wiki/ActionScript",
            docs: "https://help.adobe.com/en_US/as3/dev/index.html"
        },
        tutorials: [{
            name: "AS3 Reference",
            url: "https://help.adobe.com/en_US/as3/dev/index.html"
        }, {name: "ActionScript Wiki", url: "https://en.wikipedia.org/wiki/ActionScript"}],
        frameworks: [{name: "Apache Flex/Royale", url: "https://royale.apache.org/", desc: "Modern ActionScript UI"}],
        tools: [],
        packages: [],
        package_manager: null
    },

    {
        id: 34, sym: "Ap", name: "AppleScript", cat: "scripting", year: 1993, paradigm: "Scripting · Automation",
        desc: "Apple's natural-language scripting for automating macOS applications. Used in professional media workflows (Final Cut Pro, Logic Pro) and automated system tasks.",
        links: {
            official: "https://developer.apple.com/library/archive/documentation/AppleScript/Conceptual/AppleScriptLangGuide/",
            wiki: "https://en.wikipedia.org/wiki/AppleScript",
            docs: "https://developer.apple.com/library/archive/documentation/AppleScript/Conceptual/AppleScriptLangGuide/"
        },
        tutorials: [{
            name: "AppleScript Language Guide",
            url: "https://developer.apple.com/library/archive/documentation/AppleScript/Conceptual/AppleScriptLangGuide/"
        }, {name: "MacScripter", url: "https://macscripter.net/"}],
        frameworks: [],
        tools: [],
        packages: [],
        package_manager: null
    },

    {
        id: 35, sym: "Mj", name: "Mojo", cat: "scripting", year: 2023, paradigm: "Python superset · Systems",
        desc: "Python syntax, C++ performance. Designed for AI/ML. Claims up to 68,000x faster than Python. Built by Chris Lattner (LLVM, Swift) for Modular AI infrastructure.",
        links: {
            official: "https://www.modular.com/mojo",
            wiki: "https://en.wikipedia.org/wiki/Mojo_(programming_language)",
            docs: "https://docs.modular.com/mojo/manual/",
            github: "https://github.com/modularml/mojo",
            playground: "https://playground.modular.com/",
            reddit: "https://www.reddit.com/r/MojoLang/"
        },
        tutorials: [{name: "Mojo Manual", url: "https://docs.modular.com/mojo/manual/"}, {
            name: "Mojo Playground",
            url: "https://playground.modular.com/"
        }, {name: "Modular Docs", url: "https://docs.modular.com/"}, {
            "name": "Mojo Changelog",
            "url": "https://docs.modular.com/mojo/changelog.html"
        }, {"name": "Modular Blog", "url": "https://www.modular.com/blog"}],
        frameworks: [{name: "MAX", url: "https://www.modular.com/max", desc: "AI inference platform"}],
        tools: [],
        packages: [{name: "stdlib", url: "https://docs.modular.com/mojo/stdlib/", desc: "Mojo Standard Library"}],
        package_manager: {name: "Magic / Modular", url: "https://docs.modular.com/magic/"}
    },

    {
        id: 36, sym: "Co", name: "CoffeeScript", cat: "scripting", year: 2009, paradigm: "Transpiled · Scripting",
        desc: "Syntactic sugar that compiles to JavaScript. Hugely influenced ES6+ features including arrow functions, destructuring, and template literals. The first popular JS transpiler.",
        links: {
            official: "https://coffeescript.org/",
            wiki: "https://en.wikipedia.org/wiki/CoffeeScript",
            docs: "https://coffeescript.org/",
            github: "https://github.com/jashkenas/coffeescript",
            playground: "https://coffeescript.org/#try",
            reddit: "https://www.reddit.com/r/coffeescript/"
        },
        tutorials: [{name: "CoffeeScript.org", url: "https://coffeescript.org/"}, {
            name: "CoffeeScript Cookbook",
            url: "https://coffeescript-cookbook.github.io/"
        }, {
            "name": "CoffeeScript Cookbook",
            "url": "https://coffeescript-cookbook.github.io/"
        }, {"name": "DevDocs CoffeeScript", "url": "https://devdocs.io/coffeescript/"}],
        frameworks: [],
        tools: [],
        packages: [],
        package_manager: {name: "npm", url: "https://www.npmjs.com/"}
    },

    {
        id: 37, sym: "Hy", name: "Hy", cat: "scripting", year: 2013, paradigm: "Lisp · Python",
        desc: "A Lisp dialect embedded in Python. Write Lisp that compiles to Python AST. Get all Python libraries with Lisp macros. The best of both worlds.",
        links: {
            official: "https://hylang.org/",
            wiki: "https://en.wikipedia.org/wiki/Hy_(programming_language)",
            docs: "https://hylang.org/hy/doc/",
            github: "https://github.com/hylang/hy",
            playground: "https://try.hylang.org/"
        },
        tutorials: [{name: "Hy Tutorial", url: "https://hylang.org/hy/doc/"}, {
            name: "Try Hy Online",
            url: "https://try.hylang.org/"
        }, {"name": "Hy GitHub", "url": "https://github.com/hylang/hy"}, {
            "name": "Hy Cheatsheet",
            "url": "https://hylang.org/hy/doc/stable/cheatsheet.html"
        }],
        frameworks: [],
        tools: [],
        packages: [],
        package_manager: {name: "pip / PyPI", url: "https://pypi.org/project/hy/"}
    },

    {
        id: 38, sym: "Rk", name: "Raku", cat: "scripting", year: 2015, paradigm: "Multi-paradigm · Scripting",
        desc: "Formerly Perl 6. Gradual typing, built-in grammars for parsing, multiple dispatch, lazy lists, and one of the most powerful regex engines ever built.",
        links: {
            official: "https://raku.org/",
            wiki: "https://en.wikipedia.org/wiki/Raku_(programming_language)",
            docs: "https://docs.raku.org/",
            github: "https://github.com/rakudo/rakudo",
            playground: "https://raku.land/",
            spec: "https://docs.raku.org/language/specification",
            reddit: "https://www.reddit.com/r/rakulang/"
        },
        tutorials: [{name: "Getting Started", url: "https://raku.org/getting-started/"}, {
            name: "Raku Docs",
            url: "https://docs.raku.org/"
        }, {
            name: "Think Raku (free book)",
            url: "https://greenteapress.com/wp/think-raku/"
        }, {"name": "Exercism Raku Track", "url": "https://exercism.org/tracks/raku"}, {
            "name": "Rosetta Code Raku",
            "url": "https://rosettacode.org/wiki/Category:Raku"
        }],
        frameworks: [{name: "Cro", url: "https://cro.services/", desc: "Reactive web services"}],
        tools: [],
        packages: [],
        package_manager: {name: "zef", url: "https://github.com/ugexe/zef"}
    },

    // ── OOP ──────────────────────────────────────────────────────────
    {
        id: 39, sym: "Ja", name: "Java", cat: "oop", year: 1995, paradigm: "OOP · Multi-paradigm",
        desc: "Write once, run anywhere. One of the most widely used languages for enterprise backends, Android development, and large-scale distributed systems.",
        links: {
            official: "https://www.java.com/",
            wiki: "https://en.wikipedia.org/wiki/Java_(programming_language)",
            docs: "https://docs.oracle.com/en/java/",
            playground: "https://www.jdoodle.com/online-java-compiler/",
            github: "https://github.com/openjdk/jdk",
            spec: "https://docs.oracle.com/javase/specs/",
            reddit: "https://www.reddit.com/r/java/"
        },
        tutorials: [{name: "Oracle Java Tutorials", url: "https://docs.oracle.com/javase/tutorial/"}, {
            name: "Baeldung",
            url: "https://www.baeldung.com/"
        }, {name: "JetBrains Academy", url: "https://www.jetbrains.com/academy/"}, {
            name: "Codecademy Java",
            url: "https://www.codecademy.com/learn/learn-java"
        }, {"name": "Exercism Java Track", "url": "https://exercism.org/tracks/java"}, {
            "name": "DevDocs Java",
            "url": "https://devdocs.io/openjdk~21/"
        }],
        frameworks: [{
            name: "Spring Boot",
            url: "https://spring.io/projects/spring-boot",
            desc: "Enterprise applications"
        }, {name: "Quarkus", url: "https://quarkus.io/", desc: "Kubernetes-native Java"}, {
            name: "Micronaut",
            url: "https://micronaut.io/",
            desc: "Microservices framework"
        }],
        tools: [{name: "Maven", url: "https://maven.apache.org/", desc: "Build & dependency tool"}],
        packages: [],
        package_manager: {name: "Maven / Gradle", url: "https://mvnrepository.com/"}
    },

    {
        id: 40, sym: "Kt", name: "Kotlin", cat: "oop", year: 2011, paradigm: "OOP · Functional · JVM",
        desc: "JetBrains' modern JVM language. Android's preferred language since 2017. Null safety built-in, 100% interoperable with Java, and concise coroutines for async.",
        links: {
            official: "https://kotlinlang.org/",
            wiki: "https://en.wikipedia.org/wiki/Kotlin_(programming_language)",
            docs: "https://kotlinlang.org/docs/",
            playground: "https://play.kotlinlang.org/",
            github: "https://github.com/JetBrains/kotlin",
            spec: "https://kotlinlang.org/spec/",
            reddit: "https://www.reddit.com/r/Kotlin/"
        },
        tutorials: [{
            name: "Kotlin Docs",
            url: "https://kotlinlang.org/docs/getting-started.html"
        }, {name: "Android Developers", url: "https://developer.android.com/kotlin"}, {
            name: "Kotlin Koans",
            url: "https://play.kotlinlang.org/koans/"
        }, {name: "Kotlin by JetBrains", url: "https://www.jetbrains.com/kotlin/"}, {
            "name": "Exercism Kotlin Track",
            "url": "https://exercism.org/tracks/kotlin"
        }, {"name": "Kotlin Slack", "url": "https://surveys.jetbrains.com/s3/kotlin-slack-sign-up"}],
        frameworks: [{
            name: "Spring Boot",
            url: "https://spring.io/projects/spring-boot",
            desc: "Enterprise backend"
        }, {name: "Ktor", url: "https://ktor.io/", desc: "Async Kotlin web framework"}, {
            name: "Compose Multiplatform",
            url: "https://www.jetbrains.com/lp/compose-multiplatform/",
            desc: "Cross-platform UI"
        }],
        tools: [],
        packages: [{name: "Arrow", url: "https://arrow-kt.io/", desc: "Functional programming libs"}],
        package_manager: {name: "Gradle / Maven", url: "https://gradle.org/"}
    },

    {
        id: 41, sym: "Sw", name: "Swift", cat: "oop", year: 2014, paradigm: "OOP · Protocol-oriented",
        desc: "Apple's modern language for iOS, macOS, watchOS, tvOS. Replaced Objective-C with safer, faster, more expressive code. Also runs on Linux and server-side.",
        links: {
            official: "https://www.swift.org/",
            wiki: "https://en.wikipedia.org/wiki/Swift_(programming_language)",
            docs: "https://www.swift.org/documentation/",
            playground: "https://swiftfiddle.com/",
            github: "https://github.com/apple/swift",
            spec: "https://www.swift.org/swift-book/documentation/the-swift-programming-language/",
            reddit: "https://www.reddit.com/r/swift/"
        },
        tutorials: [{
            name: "Swift.org Docs",
            url: "https://www.swift.org/getting-started/"
        }, {name: "Hacking with Swift", url: "https://www.hackingwithswift.com/"}, {
            name: "100 Days of SwiftUI",
            url: "https://www.hackingwithswift.com/100/swiftui"
        }, {
            name: "Swift Playgrounds",
            url: "https://www.apple.com/swift/playgrounds/"
        }, {"name": "Exercism Swift Track", "url": "https://exercism.org/tracks/swift"}, {
            "name": "Swift Forums",
            "url": "https://forums.swift.org/"
        }],
        frameworks: [{
            name: "SwiftUI",
            url: "https://developer.apple.com/xcode/swiftui/",
            desc: "Declarative Apple UI"
        }, {
            name: "UIKit",
            url: "https://developer.apple.com/documentation/uikit",
            desc: "Classic iOS UI"
        }, {name: "Vapor", url: "https://vapor.codes/", desc: "Server-side Swift"}],
        tools: [],
        packages: [{
            name: "Combine",
            url: "https://developer.apple.com/documentation/combine",
            desc: "Reactive programming"
        }],
        package_manager: {name: "Swift Package Manager", url: "https://swift.org/package-manager/"}
    },

    {
        id: 42, sym: "Da", name: "Dart", cat: "oop", year: 2011, paradigm: "OOP · AOT compiled",
        desc: "Google's language for Flutter. Compiles to ARM, x86, and JavaScript. Null-safe, strongly typed, and the backbone of cross-platform mobile development.",
        links: {
            official: "https://dart.dev/",
            wiki: "https://en.wikipedia.org/wiki/Dart_(programming_language)",
            docs: "https://dart.dev/guides",
            playground: "https://dartpad.dev/",
            github: "https://github.com/dart-lang/sdk",
            spec: "https://dart.dev/guides/language/spec",
            reddit: "https://www.reddit.com/r/dartlang/"
        },
        tutorials: [{name: "Dart.dev Language Tour", url: "https://dart.dev/language"}, {
            name: "Flutter Codelabs",
            url: "https://docs.flutter.dev/codelabs"
        }, {name: "Effective Dart", url: "https://dart.dev/effective-dart"}, {
            name: "DartPad",
            url: "https://dartpad.dev/"
        }, {"name": "Exercism Dart Track", "url": "https://exercism.org/tracks/dart"}, {
            "name": "Flutter Community",
            "url": "https://flutter.dev/community"
        }],
        frameworks: [{
            name: "Flutter",
            url: "https://flutter.dev/",
            desc: "Cross-platform UI toolkit"
        }, {name: "Serverpod", url: "https://serverpod.dev/", desc: "Server-side Dart framework"}],
        tools: [],
        packages: [{name: "Shelf", url: "https://pub.dev/packages/shelf", desc: "Composable web server middleware"}],
        package_manager: {name: "pub.dev", url: "https://pub.dev/"}
    },

    {
        id: 43, sym: "OC", name: "Objective-C", cat: "oop", year: 1984, paradigm: "OOP · Message-passing",
        desc: "Apple's main language before Swift. Smalltalk messaging on top of C. Still used for legacy Apple apps, and iOS internals are still heavily Objective-C under the hood.",
        links: {
            wiki: "https://en.wikipedia.org/wiki/Objective-C",
            docs: "https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/Introduction/Introduction.html",
            playground: "https://www.jdoodle.com/compile-objectivec-online/",
            reddit: "https://www.reddit.com/r/ObjectiveC/"
        },
        tutorials: [{
            name: "Apple ObjC Guide",
            url: "https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/"
        }, {name: "Tutorialspoint", url: "https://www.tutorialspoint.com/objective_c/"}, {
            "name": "Apple ObjC Docs",
            "url": "https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/"
        }, {"name": "ObjC Cheatsheet", "url": "https://devhints.io/objective-c"}],
        frameworks: [{
            name: "Cocoa",
            url: "https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/CocoaFundamentals/",
            desc: "macOS application framework"
        }, {name: "CocoaTouch", url: "https://developer.apple.com/documentation/", desc: "iOS app framework"}],
        tools: [],
        packages: [],
        package_manager: {name: "CocoaPods", url: "https://cocoapods.org/"}
    },

    {
        id: 44, sym: "Cs", name: "C#", cat: "oop", year: 2000, paradigm: "OOP · Multi-paradigm",
        desc: "Microsoft's elegant, statically-typed language. Dominates game development via Unity and enterprise .NET backends. LINQ and async/await influenced many languages.",
        links: {
            official: "https://learn.microsoft.com/en-us/dotnet/csharp/",
            wiki: "https://en.wikipedia.org/wiki/C_Sharp_(programming_language)",
            docs: "https://learn.microsoft.com/en-us/dotnet/csharp/",
            playground: "https://dotnetfiddle.net/",
            github: "https://github.com/dotnet/csharplang",
            spec: "https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/language-specification/",
            reddit: "https://www.reddit.com/r/csharp/"
        },
        tutorials: [{
            name: "Microsoft C# Docs",
            url: "https://learn.microsoft.com/en-us/dotnet/csharp/tour-of-csharp/"
        }, {name: "C# Station", url: "https://www.csharp-station.com/"}, {
            name: "Unity Learn",
            url: "https://learn.unity.com/"
        }, {"name": "Exercism C# Track", "url": "https://exercism.org/tracks/csharp"}, {
            "name": "C# Yellow Book",
            "url": "https://www.robmiles.com/c-yellow-book"
        }],
        frameworks: [{
            name: "ASP.NET Core",
            url: "https://dotnet.microsoft.com/en-us/apps/aspnet",
            desc: "Web framework"
        }, {name: "Unity", url: "https://unity.com/", desc: "Game engine"}, {
            name: "MAUI",
            url: "https://learn.microsoft.com/en-us/dotnet/maui/",
            desc: "Cross-platform UI"
        }, {
            name: "Blazor",
            url: "https://dotnet.microsoft.com/en-us/apps/aspnet/web-apps/blazor",
            desc: "WebAssembly UI"
        }],
        tools: [],
        packages: [],
        package_manager: {name: "NuGet", url: "https://www.nuget.org/"}
    },

    {
        id: 45, sym: "Sm", name: "Smalltalk", cat: "oop", year: 1972, paradigm: "Pure OOP · Message-passing",
        desc: "The language that invented OOP. Everything is an object, everything is a message. Inspired Java, Python, Ruby, and Objective-C. Live programming with image-based persistence.",
        links: {
            wiki: "https://en.wikipedia.org/wiki/Smalltalk",
            docs: "https://pharo.org/documentation",
            official: "https://pharo.org/",
            playground: "https://pharocloud.com/",
            github: "https://github.com/pharo-project/pharo",
            reddit: "https://www.reddit.com/r/smalltalk/"
        },
        tutorials: [{name: "Pharo MOOC", url: "https://mooc.pharo.org/"}, {
            name: "Smalltalk-80 (free PDF)",
            url: "https://www.cs.drexel.edu/~ed/java/smalltalk80.pdf"
        }, {name: "Pharo by Example", url: "https://books.pharo.org/"}, {
            "name": "Exercism Pharo Track",
            "url": "https://exercism.org/tracks/pharo-smalltalk"
        }, {"name": "Pharo MOOC Videos", "url": "https://www.youtube.com/channel/UCp3mNigANqkesFzdm058bvw"}],
        frameworks: [{name: "Seaside", url: "https://seaside.st/", desc: "Web framework"}],
        tools: [{name: "Pharo", url: "https://pharo.org/", desc: "Modern Smalltalk platform"}, {
            name: "VisualWorks",
            url: "https://www.cincomsmalltalk.com/main/products/visualworks/",
            desc: "Commercial Smalltalk"
        }],
        packages: [],
        package_manager: {name: "Metacello / Pharo Catalog", url: "https://catalog.pharo.org/"}
    },

    {
        id: 46, sym: "Ei", name: "Eiffel", cat: "oop", year: 1986, paradigm: "OOP · Design by Contract",
        desc: "Pioneered Design by Contract — preconditions, postconditions, and invariants as first-class language features. Used in financial systems and safety-critical software.",
        links: {
            wiki: "https://en.wikipedia.org/wiki/Eiffel_(programming_language)",
            docs: "https://www.eiffel.com/resources/manuals/",
            official: "https://www.eiffel.com/",
            playground: "https://www.jdoodle.com/execute-eiffel-online/",
            reddit: "https://www.reddit.com/r/eiffel/"
        },
        tutorials: [{
            name: "ECMA Eiffel Tutorial",
            url: "https://www.eiffel.com/resources/manuals/"
        }, {name: "Eiffel Community", url: "https://www.eiffel.community/"}, {
            "name": "Rosetta Code Eiffel",
            "url": "https://rosettacode.org/wiki/Category:Eiffel"
        }],
        frameworks: [],
        tools: [{name: "EiffelStudio", url: "https://www.eiffel.com/eiffelstudio/", desc: "IDE & compiler"}],
        packages: [{name: "Gobo", url: "https://www.gobosoft.com/", desc: "Portability libraries"}],
        package_manager: null
    },

    {
        id: 47, sym: "Sn", name: "Simula", cat: "oop", year: 1967, paradigm: "OOP · Simulation",
        desc: "The grandfather of all OOP. Invented classes, objects, and inheritance. Designed for discrete event simulation. Directly inspired C++ and Smalltalk.",
        links: {wiki: "https://en.wikipedia.org/wiki/Simula", docs: "https://www.simula67.info/"},
        tutorials: [{
            name: "Simula Historical Wiki",
            url: "https://en.wikipedia.org/wiki/Simula"
        }, {name: "Simula 67 Common Base", url: "https://www.simula67.info/"}],
        frameworks: [],
        tools: [],
        packages: [],
        package_manager: null
    },

    {
        id: 48, sym: "De", name: "Delphi", cat: "oop", year: 1995, paradigm: "OOP · RAD",
        desc: "Object Pascal for rapid application development. Dominant in Windows desktop in the 90s-2000s. Still widely used in legacy enterprise, medical software, and POS systems.",
        links: {
            official: "https://www.embarcadero.com/products/delphi",
            wiki: "https://en.wikipedia.org/wiki/Delphi_(software)",
            docs: "https://docwiki.embarcadero.com/RADStudio/en/Main_Page",
            playground: "https://delphi.dev/",
            reddit: "https://www.reddit.com/r/delphi/"
        },
        tutorials: [{
            name: "Embarcadero DocWiki",
            url: "https://docwiki.embarcadero.com/RADStudio/en/Main_Page"
        }, {name: "Learn Delphi", url: "https://learndelphi.org/"}, {
            name: "Delphi Basics",
            url: "https://www.delphibasics.co.uk/"
        }, {"name": "Embarcadero GetIt", "url": "https://getitnow.embarcadero.com/"}, {
            "name": "DelphiPraxis",
            "url": "https://en.delphipraxis.net/"
        }],
        frameworks: [{
            name: "FireMonkey",
            url: "https://www.embarcadero.com/radstudio/firemonkey",
            desc: "Cross-platform UI"
        }, {
            name: "VCL",
            url: "https://docwiki.embarcadero.com/RADStudio/en/VCL_Reference",
            desc: "Windows visual components"
        }],
        tools: [],
        packages: [],
        package_manager: {name: "GetIt Package Manager", url: "https://getitnow.embarcadero.com/"}
    },

    {
        id: 49, sym: "Ht", name: "HyperTalk", cat: "oop", year: 1987, paradigm: "Event-driven · English-like",
        desc: "Apple's natural language programming for HyperCard. One of the first mass-market scripting languages. Inspired by BASIC but with English-like syntax accessible to non-programmers.",
        links: {wiki: "https://en.wikipedia.org/wiki/HyperTalk"},
        tutorials: [{name: "HyperCard History", url: "https://en.wikipedia.org/wiki/HyperCard"}],
        frameworks: [],
        tools: [],
        packages: [],
        package_manager: null
    },

    {
        id: 50, sym: "Cf", name: "ColdFusion", cat: "oop", year: 1995, paradigm: "OOP · Web scripting",
        desc: "Rapid web development with CFML tag-based syntax. Widely used in enterprise web applications and government systems throughout the 2000s. Still maintained by Adobe.",
        links: {
            official: "https://www.adobe.com/products/coldfusion-family.html",
            wiki: "https://en.wikipedia.org/wiki/ColdFusion",
            docs: "https://helpx.adobe.com/coldfusion/home.html"
        },
        tutorials: [{
            name: "Adobe ColdFusion Docs",
            url: "https://helpx.adobe.com/coldfusion/home.html"
        }, {name: "CFDocs.org", url: "https://cfdocs.org/"}],
        frameworks: [{
            name: "FW/1",
            url: "https://framework-one.github.io/",
            desc: "Lightweight MVC framework"
        }, {name: "CFWheels", url: "https://cfwheels.org/", desc: "Ruby on Rails-inspired"}],
        tools: [],
        packages: [],
        package_manager: {name: "CommandBox / ForgeBox", url: "https://www.forgebox.io/"}
    },

    {
        id: 51, sym: "Pp", name: "PowerBuilder", cat: "oop", year: 1991, paradigm: "OOP · RAD",
        desc: "Fourth-generation language for rapid application development. DataWindow technology made database-driven apps incredibly fast to build. Still in use in banking and insurance.",
        links: {
            wiki: "https://en.wikipedia.org/wiki/PowerBuilder",
            official: "https://www.appeon.com/products/powerbuilder"
        },
        tutorials: [{
            name: "Appeon PowerBuilder",
            url: "https://www.appeon.com/products/powerbuilder"
        }, {name: "PowerBuilder Wiki", url: "https://en.wikipedia.org/wiki/PowerBuilder"}],
        frameworks: [],
        tools: [],
        packages: [],
        package_manager: null
    },

    {
        id: 52, sym: "Ab", name: "Abap", cat: "oop", year: 1983, paradigm: "OOP · Business",
        desc: "SAP's programming language for enterprise business applications. Powers ERP systems worldwide. ABAP code runs the world's largest enterprise resource planning systems.",
        links: {
            wiki: "https://en.wikipedia.org/wiki/ABAP",
            docs: "https://help.sap.com/doc/abapdocu_755_index_htm/7.55/en-US/index.htm",
            official: "https://www.sap.com/products/technology-platform/abap.html"
        },
        tutorials: [{name: "SAP Learning", url: "https://learning.sap.com/"}, {
            name: "ABAP Developer Guide",
            url: "https://help.sap.com/doc/abapdocu_755_index_htm/"
        }, {name: "openSAP", url: "https://open.sap.com/"}],
        frameworks: [{
            name: "SAP BTP",
            url: "https://www.sap.com/products/technology-platform.html",
            desc: "Business Technology Platform"
        }, {
            name: "ABAP RAP",
            url: "https://help.sap.com/docs/abap-cloud/abap-rap",
            desc: "RESTful Application Programming"
        }],
        tools: [],
        packages: [],
        package_manager: null
    },

    // ── FUNCTIONAL ───────────────────────────────────────────────────
    {
        id: 53, sym: "Hs", name: "Haskell", cat: "functional", year: 1990, paradigm: "Pure Functional · Lazy",
        desc: "The gold standard of pure functional programming. Lazy evaluation, algebraic data types, type classes, and monads. Influences nearly every modern functional language.",
        links: {
            official: "https://www.haskell.org/",
            wiki: "https://en.wikipedia.org/wiki/Haskell",
            docs: "https://haskell.org/documentation",
            playground: "https://play.haskell.org/",
            github: "https://github.com/ghc/ghc",
            reddit: "https://www.reddit.com/r/haskell/"
        },
        tutorials: [{name: "Learn You a Haskell", url: "http://learnyouahaskell.com/"}, {
            name: "Haskell MOOC",
            url: "https://haskell.mooc.fi/"
        }, {name: "Real World Haskell", url: "http://book.realworldhaskell.org/"}, {
            name: "Haskell Wikibook",
            url: "https://en.wikibooks.org/wiki/Haskell"
        }, {"name": "Exercism Haskell Track", "url": "https://exercism.org/tracks/haskell"}, {
            "name": "Haskell Weekly",
            "url": "https://haskellweekly.news/"
        }],
        frameworks: [{
            name: "Yesod",
            url: "https://www.yesodweb.com/",
            desc: "Type-safe web framework"
        }, {name: "Servant", url: "https://www.servant.dev/", desc: "REST API framework"}],
        tools: [{name: "GHC", url: "https://www.haskell.org/ghc/", desc: "Glasgow Haskell Compiler"}],
        packages: [{name: "Pandoc", url: "https://pandoc.org/", desc: "Universal document converter"}],
        package_manager: {name: "Cabal / Hackage / Stack", url: "https://hackage.haskell.org/"}
    },

    {
        id: 54, sym: "Er", name: "Erlang", cat: "functional", year: 1986, paradigm: "Functional · Concurrent",
        desc: "Built by Ericsson for telecom. Legendary for nine-nines (99.9999999%) availability. Actor model for concurrency. The runtime behind WhatsApp (2 billion users, 32 engineers).",
        links: {
            official: "https://www.erlang.org/",
            wiki: "https://en.wikipedia.org/wiki/Erlang_(programming_language)",
            docs: "https://www.erlang.org/doc/",
            github: "https://github.com/erlang/otp",
            playground: "https://replit.com/languages/erlang",
            spec: "https://www.erlang.org/doc/reference_manual/users_guide.html",
            reddit: "https://www.reddit.com/r/erlang/"
        },
        tutorials: [{
            name: "Learn You Some Erlang",
            url: "https://learnyousomeerlang.com/"
        }, {name: "Erlang Official Docs", url: "https://www.erlang.org/doc/"}, {
            name: "Erlang Solutions Blog",
            url: "https://www.erlang-solutions.com/blog/"
        }, {"name": "Exercism Erlang Track", "url": "https://exercism.org/tracks/erlang"}, {
            "name": "Erlang in Anger",
            "url": "https://www.erlang-in-anger.com/"
        }],
        frameworks: [{
            name: "OTP",
            url: "https://www.erlang.org/doc/design_principles/des_princ.html",
            desc: "Open Telecom Platform"
        }, {name: "Cowboy", url: "https://ninenines.eu/", desc: "HTTP server"}],
        tools: [],
        packages: [{name: "RabbitMQ", url: "https://www.rabbitmq.com/", desc: "Message broker built in Erlang"}],
        package_manager: {name: "Hex.pm / rebar3", url: "https://hex.pm/"}
    },

    {
        id: 55, sym: "Ex", name: "Elixir", cat: "functional", year: 2012, paradigm: "Functional · Concurrent",
        desc: "Ruby-like syntax on the Erlang VM. Phoenix enables real-time apps with millions of concurrent connections. Discord uses Elixir to handle 5+ million concurrent users.",
        links: {
            official: "https://elixir-lang.org/",
            wiki: "https://en.wikipedia.org/wiki/Elixir_(programming_language)",
            docs: "https://hexdocs.pm/elixir/",
            playground: "https://livebook.dev/",
            github: "https://github.com/elixir-lang/elixir",
            spec: "https://hexdocs.pm/elixir/syntax-reference.html",
            reddit: "https://www.reddit.com/r/elixir/"
        },
        tutorials: [{name: "Elixir School", url: "https://elixirschool.com/"}, {
            name: "Getting Started Guide",
            url: "https://elixir-lang.org/getting-started/"
        }, {name: "Exercism Elixir", url: "https://exercism.org/tracks/elixir"}, {
            name: "Livebook",
            url: "https://livebook.dev/"
        }, {"name": "Exercism Elixir Track", "url": "https://exercism.org/tracks/elixir"}, {
            "name": "Alchemist Camp",
            "url": "https://alchemist.camp/"
        }],
        frameworks: [{
            name: "Phoenix",
            url: "https://www.phoenixframework.org/",
            desc: "Productive web framework"
        }, {name: "Nerves", url: "https://nerves-project.org/", desc: "Embedded Linux with Elixir"}],
        tools: [],
        packages: [{
            name: "LiveView",
            url: "https://hexdocs.pm/phoenix_live_view/",
            desc: "Real-time server rendering"
        }, {name: "Ecto", url: "https://hexdocs.pm/ecto/", desc: "Database wrapper & query"}],
        package_manager: {name: "Hex / Mix", url: "https://hex.pm/"}
    },

    {
        id: 56, sym: "Fh", name: "F#", cat: "functional", year: 2005, paradigm: "Functional · .NET",
        desc: "Functional-first language on .NET. Strong type inference, seamless C# interop, and discriminated unions. Popular in quantitative finance and data science in .NET.",
        links: {
            official: "https://fsharp.org/",
            wiki: "https://en.wikipedia.org/wiki/F_Sharp_(programming_language)",
            docs: "https://fsharp.org/learn/",
            github: "https://github.com/dotnet/fsharp",
            playground: "https://try.fsharp.org/",
            reddit: "https://www.reddit.com/r/fsharp/"
        },
        tutorials: [{name: "F# for Fun and Profit", url: "https://fsharpforfunandprofit.com/"}, {
            name: "Tour of F#",
            url: "https://docs.microsoft.com/en-us/dotnet/fsharp/tour"
        }, {name: "F# Koans", url: "https://github.com/ChrisMarinos/FSharpKoans"}, {
            "name": "Exercism F# Track",
            "url": "https://exercism.org/tracks/fsharp"
        }, {"name": "F# Weekly", "url": "https://sergeytihon.com/"}],
        frameworks: [{
            name: "SAFE Stack",
            url: "https://safe-stack.github.io/",
            desc: "Full-stack F# web"
        }, {name: "Giraffe", url: "https://github.com/giraffe-fsharp/Giraffe", desc: "Functional web framework"}],
        tools: [{name: "Fable", url: "https://fable.io/", desc: "F# to JavaScript compiler"}],
        packages: [],
        package_manager: {name: "NuGet / Paket", url: "https://www.nuget.org/"}
    },

    {
        id: 57, sym: "Cl", name: "Clojure", cat: "functional", year: 2007, paradigm: "Functional · Lisp · JVM",
        desc: "Modern Lisp on the JVM. Emphasizes immutability and persistent data structures. Beloved for concurrency, data pipelines, and REPL-driven development. ClojureScript targets browsers.",
        links: {
            official: "https://clojure.org/",
            wiki: "https://en.wikipedia.org/wiki/Clojure",
            docs: "https://clojuredocs.org/",
            github: "https://github.com/clojure/clojure",
            playground: "https://clojuredocs.org/",
            spec: "https://clojure.org/reference/reader",
            reddit: "https://www.reddit.com/r/Clojure/"
        },
        tutorials: [{name: "Brave Clojure (free book)", url: "https://www.braveclojure.com/"}, {
            name: "Clojure Docs",
            url: "https://clojuredocs.org/"
        }, {name: "4Clojure", url: "https://4clojure.oxal.org/"}, {
            "name": "Exercism Clojure Track",
            "url": "https://exercism.org/tracks/clojure"
        }, {"name": "Clojure Koans", "url": "http://clojurekoans.com/"}],
        frameworks: [{
            name: "Ring",
            url: "https://github.com/ring-clojure/ring",
            desc: "HTTP abstraction layer"
        }, {
            name: "Compojure",
            url: "https://github.com/weavejester/compojure",
            desc: "Routing library"
        }, {name: "Re-frame", url: "https://day8.github.io/re-frame/", desc: "ClojureScript SPA framework"}],
        tools: [],
        packages: [{name: "Datomic", url: "https://www.datomic.com/", desc: "Immutable database"}],
        package_manager: {name: "Leiningen / deps.edn", url: "https://leiningen.org/"}
    },

    {
        id: 58, sym: "Sc", name: "Scala", cat: "functional", year: 2004, paradigm: "Functional · OOP · JVM",
        desc: "JVM language blending OOP and functional. Backbone of Apache Spark and big data engineering. Akka and Play Framework for reactive systems. Used at Twitter, LinkedIn, Airbnb.",
        links: {
            official: "https://www.scala-lang.org/",
            wiki: "https://en.wikipedia.org/wiki/Scala_(programming_language)",
            docs: "https://docs.scala-lang.org/",
            playground: "https://scastie.scala-lang.org/",
            github: "https://github.com/scala/scala",
            spec: "https://www.scala-lang.org/files/archive/spec/3.4/",
            reddit: "https://www.reddit.com/r/scala/"
        },
        tutorials: [{name: "Tour of Scala", url: "https://docs.scala-lang.org/tour/"}, {
            name: "Scala Exercises",
            url: "https://www.scala-exercises.org/"
        }, {name: "Rock the JVM", url: "https://rockthejvm.com/"}, {
            name: "Functional Programming in Scala",
            url: "https://www.coursera.org/learn/scala-functional-programming"
        }, {"name": "Exercism Scala Track", "url": "https://exercism.org/tracks/scala"}, {
            "name": "Scala Center",
            "url": "https://scala.epfl.ch/"
        }],
        frameworks: [{name: "Akka", url: "https://akka.io/", desc: "Actor model concurrency"}, {
            name: "Play Framework",
            url: "https://www.playframework.com/",
            desc: "Reactive web framework"
        }],
        tools: [],
        packages: [{name: "Apache Spark", url: "https://spark.apache.org/", desc: "Big data processing"}, {
            name: "ZIO",
            url: "https://zio.dev/",
            desc: "Type-safe async & concurrent"
        }],
        package_manager: {name: "sbt / Maven", url: "https://www.scala-sbt.org/"}
    },

    {
        id: 59, sym: "Om", name: "OCaml", cat: "functional", year: 1996, paradigm: "Functional · OOP · Compiled",
        desc: "Efficient functional language with a powerful module system. Used at Jane Street (quantitative trading) and Meta (Hack, Flow). Compiles to native code with excellent performance.",
        links: {
            official: "https://ocaml.org/",
            wiki: "https://en.wikipedia.org/wiki/OCaml",
            docs: "https://ocaml.org/docs",
            github: "https://github.com/ocaml/ocaml",
            playground: "https://v2.ocaml.org/learn/tutorials/",
            spec: "https://v2.ocaml.org/api/",
            reddit: "https://www.reddit.com/r/ocaml/"
        },
        tutorials: [{name: "OCaml Docs", url: "https://ocaml.org/docs"}, {
            name: "Real World OCaml",
            url: "https://dev.realworldocaml.org/"
        }, {name: "CS3110 (Cornell)", url: "https://cs3110.github.io/textbook/"}, {
            "name": "Exercism OCaml Track",
            "url": "https://exercism.org/tracks/ocaml"
        }, {"name": "OCamlverse", "url": "https://ocamlverse.net/"}],
        frameworks: [{name: "Dream", url: "https://aantron.github.io/dream/", desc: "Web framework"}],
        tools: [{name: "Dune", url: "https://dune.build/", desc: "Build system"}],
        packages: [{name: "Lwt", url: "https://ocsigen.org/lwt/", desc: "Concurrent programming library"}],
        package_manager: {name: "opam / ocamlfind", url: "https://opam.ocaml.org/"}
    },

    {
        id: 60, sym: "Li", name: "Lisp", cat: "functional", year: 1958, paradigm: "Functional · Symbolic",
        desc: "The second oldest high-level language still in use. Pioneered garbage collection, dynamic typing, REPL, and higher-order functions. Code as data, data as code.",
        links: {
            wiki: "https://en.wikipedia.org/wiki/Lisp_(programming_language)",
            docs: "https://lisp-lang.org/",
            official: "https://lisp-lang.org/",
            playground: "https://rextester.com/l/common_lisp_online_compiler",
            github: "https://github.com/sbcl/sbcl",
            reddit: "https://www.reddit.com/r/lisp/"
        },
        tutorials: [{name: "Lisp-Lang.org", url: "https://lisp-lang.org/"}, {
            name: "SICP (MIT, free)",
            url: "https://mitpress.mit.edu/9780262510875/structure-and-interpretation-of-computer-programs/"
        }, {name: "Practical Common Lisp", url: "https://gigamonkeys.com/book/"}, {
            "name": "Exercism Common Lisp Track",
            "url": "https://exercism.org/tracks/common-lisp"
        }, {"name": "L(ove) of Lisp", "url": "https://stopa.io/post/265"}],
        frameworks: [],
        tools: [{name: "Common Lisp", url: "https://common-lisp.net/", desc: "ANSI standard Lisp"}, {
            name: "SBCL",
            url: "https://www.sbcl.org/",
            desc: "Steel Bank Common Lisp"
        }, {name: "Quicklisp", url: "https://www.quicklisp.org/", desc: "Package manager"}],
        packages: [],
        package_manager: {name: "Quicklisp", url: "https://www.quicklisp.org/"}
    },

    {
        id: 61, sym: "Ss", name: "Scheme", cat: "functional", year: 1975, paradigm: "Functional · Lisp · Minimal",
        desc: "Minimalist Lisp with lexical scoping and tail-call optimization. Used to teach programming via SICP at MIT for decades. A beautiful, clean language for learning CS fundamentals.",
        links: {
            wiki: "https://en.wikipedia.org/wiki/Scheme_(programming_language)",
            docs: "https://www.schemers.org/Documents/Standards/",
            official: "https://www.scheme.org/",
            playground: "https://replit.com/languages/scheme",
            spec: "https://standards.scheme.org/",
            reddit: "https://www.reddit.com/r/scheme/"
        },
        tutorials: [{name: "HTDP (How to Design Programs)", url: "https://htdp.org/"}, {
            name: "SICP",
            url: "https://mitpress.mit.edu/9780262510875/"
        }, {
            name: "The Little Schemer",
            url: "https://mitpress.mit.edu/9780262560993/"
        }, {
            "name": "Exercism Scheme Track",
            "url": "https://exercism.org/tracks/scheme"
        }, {
            "name": "Structure & Interpretation (SICP)",
            "url": "https://mitp-content-server.mit.edu/books/content/sectbyfn/books_pres_0/6515/sicp.zip/index.html"
        }],
        frameworks: [],
        tools: [{name: "Racket", url: "https://racket-lang.org/", desc: "Scheme superset"}, {
            name: "Chicken Scheme",
            url: "https://www.call-cc.org/",
            desc: "Practical Scheme compiler"
        }, {name: "Guile", url: "https://www.gnu.org/software/guile/", desc: "GNU's extension language"}],
        packages: [],
        package_manager: {name: "CHICKEN Eggs / Guix", url: "https://wiki.call-cc.org/chicken-projects/egg-index-5"}
    },

    {
        id: 62, sym: "Ra", name: "Racket", cat: "functional", year: 1995, paradigm: "Functional · Language-oriented",
        desc: "The Language-Oriented Programming language. Build your own languages with Racket. Used in education, research, and DrRacket is the go-to IDE for learning programming.",
        links: {
            official: "https://racket-lang.org/",
            wiki: "https://en.wikipedia.org/wiki/Racket_(programming_language)",
            docs: "https://docs.racket-lang.org/",
            github: "https://github.com/racket/racket",
            playground: "https://www.racket-lang.org/",
            spec: "https://docs.racket-lang.org/reference/",
            reddit: "https://www.reddit.com/r/Racket/"
        },
        tutorials: [{
            name: "The Racket Guide",
            url: "https://docs.racket-lang.org/guide/index.html"
        }, {name: "How to Design Programs", url: "https://htdp.org/"}, {
            name: "Beautiful Racket",
            url: "https://beautifulracket.com/"
        }, {
            "name": "Exercism Racket Track",
            "url": "https://exercism.org/tracks/racket"
        }, {"name": "Rosetta Code Racket", "url": "https://rosettacode.org/wiki/Category:Racket"}],
        frameworks: [{
            name: "web-server",
            url: "https://docs.racket-lang.org/web-server/",
            desc: "Built-in web framework"
        }],
        tools: [],
        packages: [],
        package_manager: {name: "raco / Planet", url: "https://pkgs.racket-lang.org/"}
    },

    {
        id: 63, sym: "ML", name: "ML", cat: "functional", year: 1973, paradigm: "Functional · Typed",
        desc: "Meta Language. Pioneered Hindley-Milner type inference — the foundation of modern type systems. Direct ancestor of OCaml, F#, and the type systems in Haskell and Rust.",
        links: {
            wiki: "https://en.wikipedia.org/wiki/ML_(programming_language)",
            docs: "https://smlfamily.github.io/",
            playground: "https://www.jdoodle.com/execute-sml-online/",
            github: "https://github.com/SMLFamily/Successor-ML"
        },
        tutorials: [{
            name: "SML Tutorial",
            url: "https://www.cs.cmu.edu/~rwh/isml/book.pdf"
        }, {
            name: "Programming in Standard ML",
            url: "https://www.cs.cmu.edu/~rwh/isml/book.pdf"
        }, {"name": "Standard ML Tutorial", "url": "https://www.smlnj.org/doc/guide.html"}, {
            "name": "Rosetta Code SML",
            "url": "https://rosettacode.org/wiki/Category:Standard_ML"
        }],
        frameworks: [],
        tools: [{name: "SML/NJ", url: "https://www.smlnj.org/", desc: "Standard ML of NJ compiler"}, {
            name: "MLton",
            url: "http://mlton.org/",
            desc: "Whole-program compiler"
        }],
        packages: [],
        package_manager: {
            name: "SML/NJ Library",
            url: "https://smlnj-gforge.cs.uchicago.edu/scm/viewvc.php/?root=smlnj"
        }
    },

    {
        id: 64, sym: "Em", name: "Elm", cat: "functional", year: 2012, paradigm: "Functional · Frontend",
        desc: "Purely functional language for frontend web. Zero runtime exceptions guaranteed by the type system. The Elm Architecture influenced Redux and many other state management solutions.",
        links: {
            official: "https://elm-lang.org/",
            wiki: "https://en.wikipedia.org/wiki/Elm_(programming_language)",
            docs: "https://guide.elm-lang.org/",
            github: "https://github.com/elm/compiler",
            playground: "https://elm-lang.org/try",
            spec: "https://elm-lang.org/docs/syntax",
            reddit: "https://www.reddit.com/r/elm/"
        },
        tutorials: [{name: "Elm Guide", url: "https://guide.elm-lang.org/"}, {
            name: "Elm in Action (book)",
            url: "https://www.manning.com/books/elm-in-action"
        }, {name: "Exercism Elm", url: "https://exercism.org/tracks/elm"}, {
            "name": "Exercism Elm Track",
            "url": "https://exercism.org/tracks/elm"
        }, {"name": "Elm Radio", "url": "https://elm-radio.com/"}],
        frameworks: [{name: "elm-spa", url: "https://www.elm-spa.dev/", desc: "Single page app framework"}],
        tools: [],
        packages: [{
            name: "elm-ui",
            url: "https://package.elm-lang.org/packages/mdgriffith/elm-ui/latest/",
            desc: "Layout & styling"
        }],
        package_manager: {name: "elm-package", url: "https://package.elm-lang.org/"}
    },

    {
        id: 65, sym: "Id", name: "Idris", cat: "functional", year: 2011, paradigm: "Dependent types",
        desc: "Dependently-typed language where types can depend on values. Write types that are proofs and programs simultaneously. Proofs as programs, programs as proofs.",
        links: {
            official: "https://www.idris-lang.org/",
            wiki: "https://en.wikipedia.org/wiki/Idris_(programming_language)",
            docs: "https://idris2.readthedocs.io/",
            github: "https://github.com/idris-lang/Idris2",
            playground: "https://www.jdoodle.com/execute-idris-online/",
            reddit: "https://www.reddit.com/r/Idris/"
        },
        tutorials: [{
            name: "Idris 2 Docs",
            url: "https://idris2.readthedocs.io/en/latest/tutorial/index.html"
        }, {
            name: "Type-Driven Development with Idris",
            url: "https://www.manning.com/books/type-driven-development-with-idris"
        }, {"name": "Exercism Idris Track", "url": "https://exercism.org/tracks/idris"}, {
            "name": "Idris Community",
            "url": "https://discord.gg/YXmJ7tFNJ4"
        }],
        frameworks: [],
        tools: [],
        packages: [],
        package_manager: {name: "pack", url: "https://github.com/stefan-hoeck/idris2-pack"}
    },

    {
        id: 66, sym: "Ag", name: "Agda", cat: "functional", year: 2007, paradigm: "Dependent types · Proof",
        desc: "Proof assistant and dependently-typed programming language. Used in formal verification, theorem proving, and mathematical research. Programs are constructive proofs.",
        links: {
            official: "https://wiki.portal.chalmers.se/agda/",
            wiki: "https://en.wikipedia.org/wiki/Agda_(programming_language)",
            docs: "https://agda.readthedocs.io/",
            github: "https://github.com/agda/agda",
            reddit: "https://www.reddit.com/r/dependent_types/"
        },
        tutorials: [{
            name: "Programming Language Foundations in Agda",
            url: "https://plfa.github.io/"
        }, {name: "Agda Docs", url: "https://agda.readthedocs.io/"}, {
            "name": "Agda Wiki",
            "url": "https://wiki.portal.chalmers.se/agda/"
        }, {"name": "PLFA (free book)", "url": "https://plfa.github.io/"}],
        frameworks: [],
        tools: [],
        packages: [{
            name: "Standard Library",
            url: "https://github.com/agda/agda-stdlib",
            desc: "Agda standard library"
        }],
        package_manager: null
    },

    {
        id: 67, sym: "Ps", name: "PureScript", cat: "functional", year: 2013, paradigm: "Functional · Typed · JS",
        desc: "Strongly typed Haskell-inspired language that compiles to JavaScript. Great for building reliable web UIs with powerful type checking and functional abstractions.",
        links: {
            official: "https://www.purescript.org/",
            wiki: "https://en.wikipedia.org/wiki/PureScript",
            docs: "https://pursuit.purescript.org/",
            github: "https://github.com/purescript/purescript",
            playground: "https://try.purescript.org/",
            reddit: "https://www.reddit.com/r/purescript/"
        },
        tutorials: [{name: "PureScript by Example", url: "https://book.purescript.org/"}, {
            name: "Pursuit (docs)",
            url: "https://pursuit.purescript.org/"
        }, {
            name: "Jordan's Reference",
            url: "https://jordanmartinez.github.io/purescript-jordans-reference-site/"
        }, {
            "name": "Exercism PureScript Track",
            "url": "https://exercism.org/tracks/purescript"
        }, {"name": "PureScript Community", "url": "https://discourse.purescript.org/"}],
        frameworks: [{
            name: "Halogen",
            url: "https://purescript-halogen.github.io/purescript-halogen/",
            desc: "UI component framework"
        }],
        tools: [{name: "Spago", url: "https://github.com/purescript/spago", desc: "Build tool & package manager"}],
        packages: [],
        package_manager: {name: "Spago / Bower", url: "https://github.com/purescript/spago"}
    },

    {
        id: 68, sym: "Gm", name: "Gleam", cat: "functional", year: 2016, paradigm: "Functional · Type-safe",
        desc: "Type-safe functional language for the Erlang VM. Friendly error messages, no null, no exceptions. Interoperable with Elixir and Erlang. Growing fast in the BEAM ecosystem.",
        links: {
            official: "https://gleam.run/",
            wiki: "https://en.wikipedia.org/wiki/Gleam_(programming_language)",
            docs: "https://gleam.run/documentation/",
            github: "https://github.com/gleam-lang/gleam",
            playground: "https://playground.gleam.run/",
            spec: "https://gleam.run/documentation/",
            reddit: "https://www.reddit.com/r/gleamlang/"
        },
        tutorials: [{name: "Language Tour", url: "https://tour.gleam.run/"}, {
            name: "Gleam Docs",
            url: "https://gleam.run/documentation/"
        }, {name: "Exercism Gleam", url: "https://exercism.org/tracks/gleam"}, {
            "name": "Exercism Gleam Track",
            "url": "https://exercism.org/tracks/gleam"
        }, {"name": "Gleam Discord", "url": "https://discord.gg/Fm8Pwmy"}],
        frameworks: [{name: "Wisp", url: "https://github.com/lpil/wisp", desc: "Web framework"}, {
            name: "lustre",
            url: "https://github.com/lustre-labs/lustre",
            desc: "Web UI framework"
        }],
        tools: [],
        packages: [],
        package_manager: {name: "Hex", url: "https://hex.pm/"}
    },

    {
        id: 69, sym: "Fx", name: "Flix", cat: "functional", year: 2015, paradigm: "Functional · Logic",
        desc: "Principled functional and logic language on the JVM. First-class effect system, algebraic effects, and Datalog for logic programming. Research language with production ambitions.",
        links: {
            official: "https://flix.dev/",
            wiki: "https://en.wikipedia.org/wiki/Flix_(programming_language)",
            docs: "https://doc.flix.dev/",
            github: "https://github.com/flix/flix",
            playground: "https://play.flix.dev/",
            reddit: "https://www.reddit.com/r/ProgrammingLanguages/"
        },
        tutorials: [{name: "Flix Docs", url: "https://doc.flix.dev/"}, {
            name: "Flix Playground",
            url: "https://play.flix.dev/"
        }, {"name": "Flix Blog", "url": "https://flix.dev/blog/"}, {
            "name": "Flix GitHub",
            "url": "https://github.com/flix/flix"
        }],
        frameworks: [],
        tools: [],
        packages: [],
        package_manager: null
    },

    {
        id: 70, sym: "Rc", name: "Roc", cat: "functional", year: 2020, paradigm: "Functional · Fast",
        desc: "Fast, friendly, purely functional language. No runtime exceptions, no null, no global mutable state. Targets WASM, native, and can embed in host languages. By the creator of Elm.",
        links: {
            official: "https://www.roc-lang.org/",
            wiki: "https://en.wikipedia.org/wiki/Roc_(programming_language)",
            docs: "https://www.roc-lang.org/docs",
            github: "https://github.com/roc-lang/roc",
            playground: "https://www.roc-lang.org/try",
            reddit: "https://www.reddit.com/r/RocLang/"
        },
        tutorials: [{name: "Roc Tutorial", url: "https://www.roc-lang.org/tutorial"}, {
            name: "Roc Docs",
            url: "https://www.roc-lang.org/docs"
        }, {"name": "Roc GitHub", "url": "https://github.com/roc-lang/roc"}, {
            "name": "Roc Zulip Chat",
            "url": "https://roc.zulipchat.com/"
        }],
        frameworks: [],
        tools: [],
        packages: [],
        package_manager: null
    },

    // ── QUERY ────────────────────────────────────────────────────────
    {
        id: 71, sym: "Sq", name: "SQL", cat: "web", year: 1974, paradigm: "Declarative · Relational",
        desc: "The standard for relational databases. Every backend developer must know it. The most widely deployed query language in the world — unchanged at its core for 50 years.",
        links: {
            wiki: "https://en.wikipedia.org/wiki/SQL",
            docs: "https://devdocs.io/postgresql~16/",
            spec: "https://www.iso.org/standard/76583.html",
            playground: "https://www.db-fiddle.com/",
            reddit: "https://www.reddit.com/r/SQL/"
        },
        tutorials: [{name: "W3Schools SQL", url: "https://www.w3schools.com/sql/"}, {
            name: "SQLZoo",
            url: "https://sqlzoo.net/"
        }, {name: "PostgreSQL Tutorial", url: "https://www.postgresqltutorial.com/"}, {
            name: "Mode SQL Tutorial",
            url: "https://mode.com/sql-tutorial/"
        }, {"name": "SQLBolt", "url": "https://sqlbolt.com/"}, {
            "name": "Use The Index, Luke",
            "url": "https://use-the-index-luke.com/"
        }, {"name": "SQL Cheatsheet", "url": "https://devhints.io/mysql"}],
        frameworks: [],
        tools: [{
            name: "PostgreSQL",
            url: "https://www.postgresql.org/",
            desc: "Advanced open-source RDBMS"
        }, {name: "MySQL", url: "https://www.mysql.com/", desc: "World's most used open-source DB"}, {
            name: "SQLite",
            url: "https://www.sqlite.org/",
            desc: "Embedded database engine"
        }, {name: "DuckDB", url: "https://duckdb.org/", desc: "In-process analytics DB"}],
        packages: [],
        package_manager: null
    },

    {
        id: 72, sym: "Gq", name: "GraphQL", cat: "web", year: 2015, paradigm: "Query · Declarative",
        desc: "Facebook's query language for APIs. Ask for exactly what you need — nothing more, nothing less. Solves REST over/under-fetching. Used by GitHub, Shopify, Twitter.",
        links: {
            official: "https://graphql.org/",
            wiki: "https://en.wikipedia.org/wiki/GraphQL",
            docs: "https://graphql.org/learn/",
            spec: "https://spec.graphql.org/",
            github: "https://github.com/graphql/graphql-spec",
            playground: "https://studio.apollographql.com/sandbox/explorer",
            reddit: "https://www.reddit.com/r/graphql/"
        },
        tutorials: [{name: "GraphQL.org Learn", url: "https://graphql.org/learn/"}, {
            name: "How to GraphQL",
            url: "https://www.howtographql.com/"
        }, {name: "Apollo Docs", url: "https://www.apollographql.com/docs/"}, {
            "name": "GraphQL Playground",
            "url": "https://studio.apollographql.com/sandbox"
        }, {"name": "The Guild Blog", "url": "https://the-guild.dev/blog"}],
        frameworks: [{
            name: "Apollo",
            url: "https://www.apollographql.com/",
            desc: "GraphQL client & server"
        }, {name: "Hasura", url: "https://hasura.io/", desc: "Instant GraphQL on Postgres"}, {
            name: "GraphQL Yoga",
            url: "https://the-guild.dev/graphql/yoga-server",
            desc: "Spec-compliant server"
        }],
        tools: [],
        packages: [],
        package_manager: null
    },

    {
        id: 73, sym: "Hm", name: "HTML", cat: "web", year: 1993, paradigm: "Markup · Declarative",
        desc: "The skeleton of the web. Every webpage ever made uses HTML. HyperText Markup Language defines the structure and meaning of web content — the foundation of the entire internet.",
        links: {
            official: "https://developer.mozilla.org/en-US/docs/Web/HTML",
            wiki: "https://en.wikipedia.org/wiki/HTML",
            docs: "https://developer.mozilla.org/en-US/docs/Web/HTML",
            spec: "https://html.spec.whatwg.org/",
            playground: "https://codepen.io/",
            github: "https://github.com/whatwg/html",
            reddit: "https://www.reddit.com/r/html5/"
        },
        tutorials: [{
            name: "MDN HTML",
            url: "https://developer.mozilla.org/en-US/docs/Learn/HTML"
        }, {name: "W3Schools HTML", url: "https://www.w3schools.com/html/"}, {
            name: "HTML.com",
            url: "https://html.com/"
        }, {name: "The Odin Project", url: "https://www.theodinproject.com/"}, {
            "name": "Can I Use",
            "url": "https://caniuse.com/"
        }, {"name": "HTML Reference", "url": "https://htmlreference.io/"}],
        frameworks: [],
        tools: [{name: "WHATWG", url: "https://whatwg.org/", desc: "HTML Living Standard"}, {
            name: "W3C Validator",
            url: "https://validator.w3.org/",
            desc: "HTML validation tool"
        }],
        packages: [],
        package_manager: null
    },

    {
        id: 74, sym: "Cx", name: "CSS", cat: "web", year: 1996, paradigm: "Style sheet · Declarative",
        desc: "Cascading Style Sheets. Transforms plain HTML into beautiful interfaces. Controls layout, animation, responsive design, and visual presentation of every website.",
        links: {
            official: "https://developer.mozilla.org/en-US/docs/Web/CSS",
            wiki: "https://en.wikipedia.org/wiki/CSS",
            docs: "https://developer.mozilla.org/en-US/docs/Web/CSS",
            spec: "https://www.w3.org/Style/CSS/",
            playground: "https://codepen.io/",
            github: "https://github.com/w3c/csswg-drafts",
            reddit: "https://www.reddit.com/r/css/"
        },
        tutorials: [{
            name: "MDN CSS",
            url: "https://developer.mozilla.org/en-US/docs/Learn/CSS"
        }, {name: "Flexbox Froggy", url: "https://flexboxfroggy.com/"}, {
            name: "Grid Garden",
            url: "https://cssgridgarden.com/"
        }, {name: "CSS-Tricks", url: "https://css-tricks.com/"}, {
            "name": "CSS Reference",
            "url": "https://cssreference.io/"
        }, {"name": "Can I Use", "url": "https://caniuse.com/"}, {
            "name": "CSS Battle",
            "url": "https://cssbattle.dev/"
        }],
        frameworks: [{
            name: "Tailwind CSS",
            url: "https://tailwindcss.com/",
            desc: "Utility-first CSS"
        }, {name: "Bootstrap", url: "https://getbootstrap.com/", desc: "Component library"}],
        tools: [{name: "Sass", url: "https://sass-lang.com/", desc: "CSS preprocessor"}, {
            name: "PostCSS",
            url: "https://postcss.org/",
            desc: "CSS transformation tool"
        }],
        packages: [],
        package_manager: null
    },

    {
        id: 75, sym: "Cy", name: "Cypher", cat: "web", year: 2011, paradigm: "Query · Graph database",
        desc: "Neo4j's ASCII-art pattern-matching query language for graph databases. SQL for connected data — relationships are first-class citizens. Powers recommendation engines and knowledge graphs.",
        links: {
            official: "https://neo4j.com/developer/cypher/",
            wiki: "https://en.wikipedia.org/wiki/Cypher_(query_language)",
            docs: "https://neo4j.com/docs/cypher-manual/current/",
            spec: "https://opencypher.org/",
            reddit: "https://www.reddit.com/r/neo4j/"
        },
        tutorials: [{
            name: "Neo4j Cypher Manual",
            url: "https://neo4j.com/docs/cypher-manual/"
        }, {name: "Cypher Sandbox", url: "https://sandbox.neo4j.com/"}, {
            name: "Neo4j GraphAcademy",
            url: "https://graphacademy.neo4j.com/"
        }, {"name": "Cypher Cheatsheet", "url": "https://neo4j.com/docs/cypher-cheat-sheet/"}, {
            "name": "openCypher",
            "url": "https://opencypher.org/"
        }],
        frameworks: [],
        tools: [{name: "Neo4j", url: "https://neo4j.com/", desc: "Graph database platform"}, {
            name: "openCypher",
            url: "https://opencypher.org/",
            desc: "Open Cypher specification"
        }],
        packages: [],
        package_manager: null
    },

    {
        id: 76, sym: "Pl", name: "PL/SQL", cat: "web", year: 1991, paradigm: "Procedural SQL · Oracle",
        desc: "Oracle's procedural extension to SQL. Stored procedures, triggers, cursors, and packages directly in the database. Powers critical Oracle database applications worldwide.",
        links: {
            official: "https://www.oracle.com/database/technologies/appdev/plsql.html",
            wiki: "https://en.wikipedia.org/wiki/PL/SQL",
            docs: "https://docs.oracle.com/en/database/oracle/oracle-database/21/lnpls/",
            playground: "https://livesql.oracle.com/",
            reddit: "https://www.reddit.com/r/oracle/"
        },
        tutorials: [{
            name: "Oracle PL/SQL Docs",
            url: "https://docs.oracle.com/en/database/oracle/oracle-database/21/lnpls/"
        }, {name: "PLSQL Tutorial", url: "https://www.plsqltutorial.com/"}, {
            name: "Oracle LiveSQL",
            url: "https://livesql.oracle.com/"
        }, {"name": "PL/SQL Cheatsheet", "url": "https://devhints.io/plsql"}, {
            "name": "AskTOM",
            "url": "https://asktom.oracle.com/"
        }],
        frameworks: [{name: "Oracle APEX", url: "https://apex.oracle.com/", desc: "Low-code web apps on Oracle DB"}],
        tools: [{name: "Oracle Database", url: "https://www.oracle.com/database/", desc: "Enterprise RDBMS"}],
        packages: [],
        package_manager: null
    },

    {
        id: 77, sym: "Xs", name: "XSLT", cat: "web", year: 1999, paradigm: "Transformation · XML",
        desc: "Transform XML into HTML, other XML, or text. The power tool for XML pipelines in enterprise systems, document processing, and EDI. A functional, declarative language for trees.",
        links: {
            wiki: "https://en.wikipedia.org/wiki/XSLT",
            docs: "https://www.w3.org/TR/xslt20/",
            spec: "https://www.w3.org/TR/xslt20/",
            playground: "https://xsltfiddle.liberty-development.net/"
        },
        tutorials: [{
            name: "W3Schools XSLT",
            url: "https://www.w3schools.com/xml/xsl_intro.asp"
        }, {name: "XSLT Tutorial", url: "https://www.tutorialspoint.com/xslt/"}, {
            name: "Zvon XSLT Reference",
            url: "https://zvon.org/xxl/XSLTreference/"
        }, {
            "name": "XSLT Fiddle",
            "url": "https://xsltfiddle.liberty-development.net/"
        }, {"name": "Zvon XSLT Reference", "url": "https://zvon.org/xxl/XSLTreference/"}],
        frameworks: [],
        tools: [{name: "Saxon", url: "https://www.saxonica.com/", desc: "XSLT 3.0 processor"}],
        packages: [{name: "libxslt", url: "https://gitlab.gnome.org/GNOME/libxslt", desc: "GNOME XSLT library"}],
        package_manager: null
    },

    {
        id: 78, sym: "Sp", name: "SPARQL", cat: "web", year: 2008, paradigm: "Query · RDF",
        desc: "Query language for RDF semantic web data. Powers knowledge graphs at Google, the BBC, and the EU. The SQL of the semantic web and linked data.",
        links: {
            official: "https://www.w3.org/TR/sparql11-overview/",
            wiki: "https://en.wikipedia.org/wiki/SPARQL",
            docs: "https://www.w3.org/TR/sparql11-query/",
            spec: "https://www.w3.org/TR/sparql11-query/",
            playground: "https://query.wikidata.org/",
            reddit: "https://www.reddit.com/r/semanticweb/"
        },
        tutorials: [{
            name: "W3C SPARQL Tutorial",
            url: "https://www.w3.org/TR/sparql11-query/"
        }, {name: "SPARQL by Example", url: "https://www.w3.org/2009/Talks/0615-qbe/"}, {
            name: "Wikidata SPARQL",
            url: "https://query.wikidata.org/"
        }, {"name": "Wikidata Query", "url": "https://query.wikidata.org/"}, {
            "name": "SPARQL Tutorial",
            "url": "https://jena.apache.org/tutorials/sparql.html"
        }],
        frameworks: [{name: "Apache Jena", url: "https://jena.apache.org/", desc: "Java RDF framework"}],
        tools: [{
            name: "Blazegraph",
            url: "https://blazegraph.com/",
            desc: "Graph database with SPARQL"
        }, {name: "Wikidata Query", url: "https://query.wikidata.org/", desc: "Real SPARQL playground"}],
        packages: [],
        package_manager: null
    },

    {
        id: 79, sym: "Cq", name: "CQL", cat: "web", year: 2012, paradigm: "Query · Wide-column",
        desc: "Cassandra Query Language. SQL-like syntax for Apache Cassandra's wide-column store. Powers Facebook, Netflix, Apple iCloud, and Discord's message storage at massive scale.",
        links: {
            official: "https://cassandra.apache.org/doc/latest/cassandra/developing/cql/",
            wiki: "https://en.wikipedia.org/wiki/Apache_Cassandra",
            docs: "https://cassandra.apache.org/doc/latest/cassandra/developing/cql/"
        },
        tutorials: [{
            name: "Cassandra CQL Tutorial",
            url: "https://cassandra.apache.org/doc/latest/cassandra/developing/cql/"
        }, {name: "DataStax Cassandra", url: "https://www.datastax.com/guides/what-is-cassandra"}],
        frameworks: [],
        tools: [{
            name: "Apache Cassandra",
            url: "https://cassandra.apache.org/",
            desc: "Wide-column NoSQL DB"
        }, {
            name: "DataStax Astra",
            url: "https://www.datastax.com/products/datastax-astra",
            desc: "Managed Cassandra"
        }],
        packages: [],
        package_manager: null
    },

    {
        id: 80, sym: "Mn", name: "MQL", cat: "web", year: 2009, paradigm: "Query · Document DB",
        desc: "MongoDB Query Language. JSON-based query language for document databases. Aggregation pipelines for complex data transformations. Powers millions of applications worldwide.",
        links: {
            official: "https://www.mongodb.com/docs/manual/tutorial/query-documents/",
            wiki: "https://en.wikipedia.org/wiki/MongoDB",
            docs: "https://www.mongodb.com/docs/"
        },
        tutorials: [{name: "MongoDB University", url: "https://university.mongodb.com/"}, {
            name: "MQL Docs",
            url: "https://www.mongodb.com/docs/manual/tutorial/query-documents/"
        }, {name: "MongoDB Aggregation", url: "https://www.mongodb.com/docs/manual/aggregation/"}],
        frameworks: [],
        tools: [{name: "MongoDB", url: "https://www.mongodb.com/", desc: "Document database"}, {
            name: "Atlas",
            url: "https://www.mongodb.com/atlas/database",
            desc: "Managed MongoDB service"
        }],
        packages: [{name: "Mongoose", url: "https://mongoosejs.com/", desc: "MongoDB ODM for Node.js"}],
        package_manager: null
    },

    // ── SCIENTIFIC ───────────────────────────────────────────────────
    {
        id: 81, sym: "R", name: "R", cat: "scientific", year: 1993, paradigm: "Statistical · Functional",
        desc: "The statistician's language. Built for data analysis, bioinformatics, and visualization. 20,000+ packages on CRAN. The go-to for academic research and clinical trials.",
        links: {
            official: "https://www.r-project.org/",
            wiki: "https://en.wikipedia.org/wiki/R_(programming_language)",
            docs: "https://www.rdocumentation.org/",
            playground: "https://rdrr.io/snippets/",
            github: "https://github.com/r-devel/r-svn",
            spec: "https://cran.r-project.org/doc/manuals/r-release/R-lang.html",
            reddit: "https://www.reddit.com/r/rstats/"
        },
        tutorials: [{name: "R for Data Science", url: "https://r4ds.had.co.nz/"}, {
            name: "Swirl",
            url: "https://swirlstats.com/"
        }, {name: "CRAN Manuals", url: "https://cran.r-project.org/manuals.html"}, {
            name: "Posit Learn",
            url: "https://posit.co/learn/"
        }, {"name": "Exercism R Track", "url": "https://exercism.org/tracks/r"}, {
            "name": "R-bloggers",
            "url": "https://www.r-bloggers.com/"
        }],
        frameworks: [{name: "Shiny", url: "https://shiny.posit.co/", desc: "Interactive web apps"}],
        tools: [],
        packages: [{
            name: "Tidyverse",
            url: "https://www.tidyverse.org/",
            desc: "Data science packages"
        }, {name: "ggplot2", url: "https://ggplot2.tidyverse.org/", desc: "Data visualization"}, {
            name: "RMarkdown",
            url: "https://rmarkdown.rstudio.com/",
            desc: "Reproducible reports"
        }],
        package_manager: {name: "CRAN / Bioconductor", url: "https://cran.r-project.org/"}
    },

    {
        id: 82, sym: "M", name: "MATLAB", cat: "scientific", year: 1984, paradigm: "Array · Scientific",
        desc: "Numerical computation, matrix operations, signal processing, and engineering simulation. Standard in academia and industry — aerospace, automotive, medical devices, and telecoms.",
        links: {
            official: "https://www.mathworks.com/products/matlab.html",
            wiki: "https://en.wikipedia.org/wiki/MATLAB",
            docs: "https://www.mathworks.com/help/matlab/",
            playground: "https://www.mathworks.com/products/matlab/online.html",
            reddit: "https://www.reddit.com/r/matlab/"
        },
        tutorials: [{
            name: "MATLAB Onramp",
            url: "https://www.mathworks.com/learn/tutorials/matlab-onramp.html"
        }, {name: "MATLAB Docs", url: "https://www.mathworks.com/help/matlab/"}, {
            name: "Coursera MATLAB",
            url: "https://www.coursera.org/learn/matlab"
        }, {
            "name": "MATLAB Cheatsheet",
            "url": "https://www.mathworks.com/content/dam/mathworks/fact-sheet/matlab-cheat-sheet.pdf"
        }, {"name": "File Exchange", "url": "https://www.mathworks.com/matlabcentral/fileexchange/"}],
        frameworks: [],
        tools: [{
            name: "Simulink",
            url: "https://www.mathworks.com/products/simulink.html",
            desc: "Model-based design"
        }],
        packages: [{
            name: "Signal Processing Toolbox",
            url: "https://www.mathworks.com/products/signal.html",
            desc: "DSP tools"
        }, {
            name: "Deep Learning Toolbox",
            url: "https://www.mathworks.com/products/deep-learning.html",
            desc: "Neural networks"
        }],
        package_manager: {
            name: "MATLAB Add-On Explorer",
            url: "https://www.mathworks.com/products/matlab/add-on-explorer.html"
        }
    },

    {
        id: 83, sym: "Ju", name: "Julia", cat: "scientific", year: 2012, paradigm: "Scientific · Multi-paradigm",
        desc: "Fast as C, dynamic as Python, mathematical as MATLAB. JIT compilation via LLVM. The preferred language for computational science, differential equations, and scientific ML.",
        links: {
            official: "https://julialang.org/",
            wiki: "https://en.wikipedia.org/wiki/Julia_(programming_language)",
            docs: "https://docs.julialang.org/",
            playground: "https://julialang.org/learning/",
            github: "https://github.com/JuliaLang/julia",
            spec: "https://docs.julialang.org/en/v1/manual/",
            reddit: "https://www.reddit.com/r/Julia/"
        },
        tutorials: [{name: "Julia Academy", url: "https://juliaacademy.com/"}, {
            name: "Julia Docs",
            url: "https://docs.julialang.org/en/v1/manual/"
        }, {name: "Think Julia", url: "https://benlauwens.github.io/ThinkJulia.jl/"}, {
            name: "Introduction to Julia",
            url: "https://juliaacademy.com/p/intro-to-julia"
        }, {"name": "Exercism Julia Track", "url": "https://exercism.org/tracks/julia"}, {
            "name": "Julia Discourse",
            "url": "https://discourse.julialang.org/"
        }],
        frameworks: [{name: "Genie.jl", url: "https://genieframework.com/", desc: "Web framework"}],
        tools: [],
        packages: [{name: "Flux.jl", url: "https://fluxml.ai/", desc: "Machine learning"}, {
            name: "Plots.jl",
            url: "https://docs.juliaplots.org/",
            desc: "Visualization"
        }, {name: "DifferentialEquations.jl", url: "https://diffeq.sciml.ai/", desc: "ODE/PDE solvers"}],
        package_manager: {name: "Pkg.jl / JuliaHub", url: "https://julialang.org/packages/"}
    },

    {
        id: 84, sym: "Ot", name: "Octave", cat: "scientific", year: 1988, paradigm: "Array · Scientific",
        desc: "Free, open-source, mostly MATLAB-compatible numerical computing environment. Widely used in academia, scientific research, and as a cost-free MATLAB alternative for education.",
        links: {
            official: "https://octave.org/",
            wiki: "https://en.wikipedia.org/wiki/GNU_Octave",
            docs: "https://octave.org/doc/v8.1.0/",
            github: "https://hg.savannah.gnu.org/hgweb/octave/",
            playground: "https://octave-online.net/",
            reddit: "https://www.reddit.com/r/matlab/"
        },
        tutorials: [{name: "Octave Docs", url: "https://octave.org/doc/"}, {
            name: "Octave Tutorial",
            url: "https://www.gnu.org/software/octave/learn"
        }, {
            name: "Coursera ML (Octave)",
            url: "https://www.coursera.org/learn/machine-learning"
        }, {
            "name": "Rosetta Code Octave",
            "url": "https://rosettacode.org/wiki/Category:Octave"
        }, {"name": "Octave-Online", "url": "https://octave-online.net/"}],
        frameworks: [],
        tools: [{
            name: "Octave Forge",
            url: "https://octave.sourceforge.io/",
            desc: "Additional packages"
        }, {name: "Octave Online", url: "https://octave-online.net/", desc: "Browser-based Octave"}],
        packages: [],
        package_manager: {name: "Octave Forge Packages", url: "https://octave.sourceforge.io/packages.php"}
    },

    {
        id: 85, sym: "AP", name: "APL", cat: "scientific", year: 1966, paradigm: "Array · Functional",
        desc: "Extremely concise array language using symbolic notation. Entire algorithms fit in a single line. Influenced J, Q, and NumPy. Ken Iverson won the Turing Award for it.",
        links: {
            wiki: "https://en.wikipedia.org/wiki/APL_(programming_language)",
            docs: "https://help.dyalog.com/",
            official: "https://aplwiki.com/",
            playground: "https://tryapl.org/",
            github: "https://github.com/Dyalog/APL",
            reddit: "https://www.reddit.com/r/apljk/"
        },
        tutorials: [{name: "TryAPL", url: "https://tryapl.org/"}, {
            name: "APL Wiki",
            url: "https://aplwiki.com/"
        }, {
            name: "Mastering Dyalog APL",
            url: "https://www.dyalog.com/mastering-dyalog-apl.htm"
        }, {
            "name": "APL Orchard",
            "url": "https://chat.stackexchange.com/rooms/52405/the-apl-orchard"
        }, {"name": "Rosetta Code APL", "url": "https://rosettacode.org/wiki/Category:APL"}],
        frameworks: [],
        tools: [{
            name: "Dyalog APL",
            url: "https://www.dyalog.com/",
            desc: "Commercial APL interpreter"
        }, {name: "GNU APL", url: "https://www.gnu.org/software/apl/", desc: "Free APL implementation"}],
        packages: [],
        package_manager: {name: "Dyalog Package Manager", url: "https://www.dyalog.com/"}
    },

    {
        id: 86, sym: "J", name: "J", cat: "scientific", year: 1990, paradigm: "Array · Functional",
        desc: "Successor to APL using only ASCII characters. Tacit programming (point-free style), powerful array operations, and extraordinary conciseness. Created by Ken Iverson and Roger Hui.",
        links: {
            official: "https://www.jsoftware.com/#/",
            wiki: "https://en.wikipedia.org/wiki/J_(programming_language)",
            docs: "https://code.jsoftware.com/wiki/",
            playground: "https://jsoftware.com/#/developer/",
            reddit: "https://www.reddit.com/r/apljk/"
        },
        tutorials: [{name: "J Learning Vocabulary", url: "https://www.jsoftware.com/#/README"}, {
            name: "J NuVoc",
            url: "https://code.jsoftware.com/wiki/NuVoc"
        }, {name: "Rosetta Code J", url: "https://rosettacode.org/wiki/Category:J"}, {
            "name": "J NuVoc",
            "url": "https://code.jsoftware.com/wiki/NuVoc"
        }, {"name": "Rosetta Code J", "url": "https://rosettacode.org/wiki/Category:J"}],
        frameworks: [],
        tools: [],
        packages: [],
        package_manager: {name: "JAL (J Application Library)", url: "https://code.jsoftware.com/wiki/Addons"}
    },

    {
        id: 87, sym: "Wl", name: "Wolfram", cat: "scientific", year: 1988, paradigm: "Symbolic · Multi-paradigm",
        desc: "The language of Mathematica. Unparalleled symbolic computation, mathematical knowledge, and natural language processing. Powers Wolfram Alpha — the computational knowledge engine.",
        links: {
            official: "https://www.wolfram.com/language/",
            wiki: "https://en.wikipedia.org/wiki/Wolfram_Language",
            docs: "https://reference.wolfram.com/language/",
            playground: "https://www.wolframalpha.com/",
            reddit: "https://www.reddit.com/r/Mathematica/"
        },
        tutorials: [{
            name: "Fast Introduction",
            url: "https://www.wolfram.com/language/fast-introduction-for-programmers/en/"
        }, {name: "Wolfram Reference", url: "https://reference.wolfram.com/language/"}, {
            name: "Wolfram U",
            url: "https://www.wolfram.com/wolfram-u/"
        }, {"name": "Wolfram MathWorld", "url": "https://mathworld.wolfram.com/"}, {
            "name": "Wolfram Community",
            "url": "https://community.wolfram.com/"
        }],
        frameworks: [],
        tools: [{
            name: "Mathematica",
            url: "https://www.wolfram.com/mathematica/",
            desc: "Interactive computation"
        }, {
            name: "Wolfram Alpha",
            url: "https://www.wolframalpha.com/",
            desc: "Computational knowledge engine"
        }, {name: "Wolfram Cloud", url: "https://www.wolframcloud.com/", desc: "Cloud deployment"}],
        packages: [],
        package_manager: {
            name: "Wolfram Paclet Repository",
            url: "https://resources.wolframcloud.com/PacletRepository/"
        }
    },

    {
        id: 88, sym: "Sa", name: "SAS", cat: "scientific", year: 1976, paradigm: "Statistical · Procedural",
        desc: "Dominant in pharma clinical trials, healthcare analytics, and banking risk management. The regulatory gold standard — FDA requires SAS for drug approval submissions.",
        links: {
            official: "https://www.sas.com/en_us/home.html",
            wiki: "https://en.wikipedia.org/wiki/SAS_(software)",
            docs: "https://documentation.sas.com/",
            playground: "https://odamid.oda.sas.com/",
            reddit: "https://www.reddit.com/r/SAS/"
        },
        tutorials: [{
            name: "SAS Academy",
            url: "https://www.sas.com/en_us/learn/academic-programs/students.html"
        }, {
            name: "SAS OnDemand",
            url: "https://www.sas.com/en_us/software/on-demand-for-academics.html"
        }, {name: "SAS Tutorials", url: "https://support.sas.com/training/tutorial/"}, {
            "name": "SAS Communities",
            "url": "https://communities.sas.com/"
        }, {"name": "UCLA SAS Resources", "url": "https://stats.oarc.ucla.edu/sas/"}],
        frameworks: [],
        tools: [{
            name: "SAS Enterprise Guide",
            url: "https://www.sas.com/en_us/software/enterprise-guide.html",
            desc: "GUI for SAS analytics"
        }, {name: "SAS Viya", url: "https://www.sas.com/en_us/software/viya.html", desc: "Cloud analytics platform"}],
        packages: [],
        package_manager: null
    },

    {
        id: 89, sym: "St", name: "Stata", cat: "scientific", year: 1985, paradigm: "Statistical · Scripting",
        desc: "Statistical software for data management and analysis. Widely used in economics, epidemiology, and social sciences. The preferred tool in academic research publishing.",
        links: {
            official: "https://www.stata.com/",
            wiki: "https://en.wikipedia.org/wiki/Stata",
            docs: "https://www.stata.com/manuals/",
            reddit: "https://www.reddit.com/r/stata/"
        },
        tutorials: [{
            name: "Stata Resources",
            url: "https://www.stata.com/links/resources-for-learning-stata/"
        }, {name: "UCLA Stata Resources", url: "https://stats.oarc.ucla.edu/stata/"}, {
            name: "Statalist",
            url: "https://www.statalist.org/"
        }, {"name": "Stata UCLA", "url": "https://stats.oarc.ucla.edu/stata/"}, {
            "name": "Statalist",
            "url": "https://www.statalist.org/"
        }],
        frameworks: [],
        tools: [{name: "StataCorp", url: "https://www.stata.com/", desc: "Official Stata software"}],
        packages: [{
            name: "SSC Packages",
            url: "https://www.stata.com/support/faqs/resources/statalist-faq/",
            desc: "Community-written packages"
        }],
        package_manager: {name: "ssc install (SSC archive)", url: "https://ideas.repec.org/s/boc/bocode.html"}
    },

    {
        id: 90, sym: "Sl", name: "Scilab", cat: "scientific", year: 1994, paradigm: "Scientific · Numerical",
        desc: "Free and open-source numerical computation package — a MATLAB-compatible alternative developed by INRIA. Used in education and engineering in Europe and developing countries.",
        links: {
            official: "https://www.scilab.org/",
            wiki: "https://en.wikipedia.org/wiki/Scilab",
            docs: "https://help.scilab.org/",
            github: "https://github.com/scilab/scilab",
            playground: "https://cloud.scilab.in/",
            reddit: "https://www.reddit.com/r/scilab/"
        },
        tutorials: [{name: "Scilab Tutorials", url: "https://www.scilab.org/tutorials"}, {
            name: "Openeering",
            url: "https://www.openeering.com/scilab_tutorials"
        }, {name: "Scilab Online", url: "https://cloud.scilab.in/"}, {
            "name": "Scilab Cloud",
            "url": "https://cloud.scilab.in/"
        }, {"name": "Rosetta Code Scilab", "url": "https://rosettacode.org/wiki/Category:Scilab"}],
        frameworks: [],
        tools: [{
            name: "Xcos",
            url: "https://www.scilab.org/software/xcos",
            desc: "Hybrid systems modeler"
        }, {name: "Scilab Forge", url: "https://atoms.scilab.org/", desc: "Module repository"}],
        packages: [],
        package_manager: {name: "ATOMS", url: "https://atoms.scilab.org/"}
    },

    // ── ESOTERIC ─────────────────────────────────────────────────────
    {
        id: 91, sym: "Br", name: "Brainfuck", cat: "esoteric", year: 1993, paradigm: "Esoteric · Turing-complete",
        desc: "Eight commands. Turing-complete by design as an extreme challenge. Extreme minimalism as art. Created by Urban Müller to make the smallest possible compiler.",
        links: {
            wiki: "https://en.wikipedia.org/wiki/Brainfuck",
            docs: "https://esolangs.org/wiki/Brainfuck",
            playground: "https://copy.sh/brainfuck/",
            github: "https://github.com/dominikborkowski/brainfuck",
            reddit: "https://www.reddit.com/r/brainfuck/"
        },
        tutorials: [{name: "Brainfuck Overview", url: "https://esolangs.org/wiki/Brainfuck"}, {
            name: "Try Brainfuck",
            url: "https://copy.sh/brainfuck/"
        }, {name: "BF Visualizer", url: "https://brainfuck-visualizer.netlify.app/"}, {
            "name": "BF Visualizer",
            "url": "https://brainfuck-visualizer.netlify.app/"
        }, {"name": "Esolangs BF", "url": "https://esolangs.org/wiki/Brainfuck"}],
        frameworks: [],
        tools: [],
        packages: [],
        package_manager: null
    },

    {
        id: 92, sym: "W", name: "Whitespace", cat: "esoteric", year: 2003, paradigm: "Esoteric · Stack-based",
        desc: "Only spaces, tabs, and newlines are meaningful. All other characters are comments. Programs are literally invisible when printed — the ultimate steganographic language.",
        links: {
            wiki: "https://en.wikipedia.org/wiki/Whitespace_(programming_language)",
            docs: "https://esolangs.org/wiki/Whitespace",
            playground: "https://vii5ard.github.io/whitespace/"
        },
        tutorials: [{
            name: "Whitespace Tutorial",
            url: "https://esolangs.org/wiki/Whitespace"
        }, {name: "Whitespace Online", url: "https://vii5ard.github.io/whitespace/"}, {
            "name": "Whitespace IDE",
            "url": "https://vii5ard.github.io/whitespace/"
        }, {"name": "Whitespace Visualizer", "url": "https://www.dcode.fr/whitespace-language"}],
        frameworks: [],
        tools: [],
        packages: [],
        package_manager: null
    },

    {
        id: 93, sym: "Lc", name: "LOLCODE", cat: "esoteric", year: 2007, paradigm: "Esoteric · Meme-based",
        desc: "HAI CAN HAS PROGRAMMING? Turing-complete programming with LOLcat internet meme syntax. VISIBLE means print. IM IN YR LOOP iterates. Absurdist but fully functional.",
        links: {
            wiki: "https://en.wikipedia.org/wiki/LOLCODE",
            docs: "https://github.com/justinmeza/lolcode-spec",
            official: "http://www.lolcode.org/",
            playground: "https://replit.com/languages/lolcode",
            github: "https://github.com/justinmeza/lci"
        },
        tutorials: [{name: "LOLCODE.org", url: "http://www.lolcode.org/"}, {
            name: "LOLCODE Interpreter",
            url: "https://replit.com/languages/lolcode"
        }, {
            "name": "LOLCODE Spec",
            "url": "https://github.com/justinmeza/lolcode-spec/blob/master/v1.3/lolcode-spec-v1.3.md"
        }, {"name": "Try LOLCODE", "url": "https://replit.com/languages/lolcode"}],
        frameworks: [],
        tools: [],
        packages: [],
        package_manager: null
    },

    {
        id: 94, sym: "Ch", name: "Chef", cat: "esoteric", year: 2002, paradigm: "Esoteric · Recipe-based",
        desc: "Programs look like cooking recipes. Variables are ingredients with quantities, operations are cooking steps, stacks are mixing bowls, and output is served on baking dishes.",
        links: {
            wiki: "https://en.wikipedia.org/wiki/Chef_(programming_language)",
            docs: "https://www.dangermouse.net/esoteric/chef.html"
        },
        tutorials: [{
            name: "Chef Specification",
            url: "https://www.dangermouse.net/esoteric/chef.html"
        }, {name: "Esolangs Chef", url: "https://esolangs.org/wiki/Chef"}],
        frameworks: [],
        tools: [],
        packages: [],
        package_manager: null
    },

    {
        id: 95, sym: "Mb", name: "Malbolge", cat: "esoteric", year: 1998, paradigm: "Esoteric · Designed-to-fail",
        desc: "Designed to be impossible to program in. Named after the eighth circle of Hell in Dante's Inferno. Took two years for anyone to write a working program. Self-modifying hell.",
        links: {wiki: "https://en.wikipedia.org/wiki/Malbolge", docs: "https://esolangs.org/wiki/Malbolge"},
        tutorials: [{
            name: "Malbolge Overview",
            url: "https://esolangs.org/wiki/Malbolge"
        }, {name: "First Malbolge Program", url: "https://www.lscheffer.com/malbolge_interp.html"}],
        frameworks: [],
        tools: [],
        packages: [],
        package_manager: null
    },

    {
        id: 96, sym: "Bf", name: "Befunge", cat: "esoteric", year: 1993, paradigm: "Esoteric · 2D grid",
        desc: "2D stack-based language where the program counter moves in four directions through a grid. Change direction with < > ^ v. Designed to be as difficult to compile as possible.",
        links: {
            wiki: "https://en.wikipedia.org/wiki/Befunge",
            docs: "https://esolangs.org/wiki/Befunge",
            playground: "https://www.jdoodle.com/execute-befunge-online/"
        },
        tutorials: [{name: "Befunge on Esolangs", url: "https://esolangs.org/wiki/Befunge"}, {
            name: "Try Befunge",
            url: "https://befunge-98.tryitonline.net/"
        }, {"name": "Befunge Playground", "url": "https://befunge.doufu.ro/"}, {
            "name": "Esolangs Befunge",
            "url": "https://esolangs.org/wiki/Befunge-93"
        }],
        frameworks: [],
        tools: [],
        packages: [],
        package_manager: null
    },

    {
        id: 97, sym: "In", name: "Intercal", cat: "esoteric", year: 1972, paradigm: "Esoteric · Anti-language",
        desc: "Requires PLEASE for politeness (or it ignores you), uses ABSTAIN, FORGET, and IGNORE. Deliberately horrible by design. The OG esoteric language, created to satirize programming.",
        links: {
            wiki: "https://en.wikipedia.org/wiki/INTERCAL",
            docs: "https://esolangs.org/wiki/INTERCAL",
            playground: "https://tio.run/#intercal"
        },
        tutorials: [{
            name: "INTERCAL Reference Manual",
            url: "https://www.catb.org/~esr/intercal/"
        }, {name: "Try INTERCAL", url: "https://tio.run/#intercal"}, {
            "name": "TIO Intercal",
            "url": "https://tio.run/#intercal"
        }, {"name": "INTERCAL Reference", "url": "https://www.catb.org/~esr/intercal/ick.htm"}],
        frameworks: [],
        tools: [],
        packages: [],
        package_manager: null
    },

    {
        id: 98, sym: "Sh", name: "Shakespeare", cat: "esoteric", year: 2001, paradigm: "Esoteric · Play-like",
        desc: "Programs read like Shakespearean plays. Characters (Romeo, Juliet) are variables, acts and scenes are labels, and dialogue is code. Print statements involve dramatic speech.",
        links: {
            wiki: "https://en.wikipedia.org/wiki/Shakespeare_(programming_language)",
            docs: "http://shakespearelang.com/",
            playground: "https://tio.run/#spl",
            github: "https://github.com/drsam94/Spl"
        },
        tutorials: [{name: "Shakespeare Tutorial", url: "http://shakespearelang.com/"}, {
            name: "Try Shakespeare",
            url: "https://tio.run/#spl"
        }, {"name": "Shakespeare Language", "url": "http://shakespearelang.com/"}, {
            "name": "TIO Shakespeare",
            "url": "https://tio.run/#spl"
        }],
        frameworks: [],
        tools: [],
        packages: [],
        package_manager: null
    },

    {
        id: 99, sym: "Pi", name: "Piet", cat: "esoteric", year: 2001, paradigm: "Esoteric · Image-based",
        desc: "Programs are bitmap images. Named after Piet Mondrian. Color changes between adjacent colored regions determine operations. Your program looks like abstract art.",
        links: {
            wiki: "https://en.wikipedia.org/wiki/Piet_(programming_language)",
            docs: "https://www.dangermouse.net/esoteric/piet.html",
            playground: "https://www.bertnase.de/npiet/npiet-execute.php"
        },
        tutorials: [{
            name: "Piet Specification",
            url: "https://www.dangermouse.net/esoteric/piet.html"
        }, {name: "Piet Online", url: "https://www.bertnase.de/npiet/npiet-execute.php"}, {
            "name": "Piet Gallery",
            "url": "https://www.dangermouse.net/esoteric/piet/samples.html"
        }, {"name": "Piet Editor", "url": "https://gabriellesc.github.io/piet/"}],
        frameworks: [],
        tools: [],
        packages: [],
        package_manager: null
    },

    {
        id: 100, sym: "Cw", name: "COW", cat: "esoteric", year: 2003, paradigm: "Esoteric · Animal sounds",
        desc: "12 instructions, all variants of moo (MOO, mOo, moO...). A Brainfuck variant where cows do the computing. Every program looks exactly like a confused bovine conversation.",
        links: {
            wiki: "https://esolangs.org/wiki/COW",
            docs: "https://esolangs.org/wiki/COW",
            playground: "https://tio.run/#cow"
        },
        tutorials: [{name: "COW on Esolangs", url: "https://esolangs.org/wiki/COW"}, {
            name: "Try COW",
            url: "https://tio.run/#cow"
        }, {"name": "COW Esolangs", "url": "https://esolangs.org/wiki/COW"}, {
            "name": "TIO COW",
            "url": "https://tio.run/#cow"
        }],
        frameworks: [],
        tools: [],
        packages: [],
        package_manager: null
    },

    // ── LOGIC ────────────────────────────────────────────────────────
    {
        id: 101, sym: "Pr", name: "Prolog", cat: "logic", year: 1972, paradigm: "Logic · Declarative",
        desc: "Logic programming for AI, natural language processing, and expert systems. Solves problems via unification and backtracking. You declare facts and rules; Prolog finds solutions.",
        links: {
            wiki: "https://en.wikipedia.org/wiki/Prolog",
            docs: "https://www.swi-prolog.org/pldoc/",
            official: "https://www.swi-prolog.org/",
            playground: "https://swish.swi-prolog.org/",
            spec: "https://www.iso.org/standard/21413.html",
            reddit: "https://www.reddit.com/r/prolog/"
        },
        tutorials: [{name: "Learn Prolog Now!", url: "https://www.learnprolognow.org/"}, {
            name: "SWI-Prolog Docs",
            url: "https://www.swi-prolog.org/pldoc/"
        }, {name: "Prolog Tutorial", url: "https://www.tutorialspoint.com/prolog/"}, {
            "name": "SWISH Online Prolog",
            "url": "https://swish.swi-prolog.org/"
        }, {"name": "Exercism Prolog Track", "url": "https://exercism.org/tracks/prolog"}],
        frameworks: [],
        tools: [{
            name: "SWI-Prolog",
            url: "https://www.swi-prolog.org/",
            desc: "Most popular Prolog system"
        }, {name: "GNU Prolog", url: "https://gprolog.org/", desc: "ISO-compliant compiler"}, {
            name: "Ciao",
            url: "https://ciao-lang.org/",
            desc: "Multi-paradigm LP system"
        }],
        packages: [],
        package_manager: {name: "SWI-Prolog Packages", url: "https://www.swi-prolog.org/pack/list"}
    },

    {
        id: 102, sym: "Me", name: "Mercury", cat: "logic", year: 1995, paradigm: "Logic · Functional",
        desc: "Combines logic programming with static type and mode checking. Production-ready Prolog — fully compiled, no garbage collection overhead, and used in real industry applications.",
        links: {
            official: "https://mercurylang.org/",
            wiki: "https://en.wikipedia.org/wiki/Mercury_(programming_language)",
            docs: "https://mercurylang.org/documentation/",
            github: "https://github.com/Mercury-Language/mercury",
            playground: "https://www.jdoodle.com/execute-prolog-online/"
        },
        tutorials: [{
            name: "Mercury Tutorial",
            url: "https://mercurylang.org/documentation/tutorial.html"
        }, {
            name: "Mercury Reference",
            url: "https://mercurylang.org/documentation/reference.html"
        }, {
            "name": "Mercury GitHub",
            "url": "https://github.com/Mercury-Language/mercury"
        }, {"name": "Rosetta Code Mercury", "url": "https://rosettacode.org/wiki/Category:Mercury"}],
        frameworks: [],
        tools: [],
        packages: [],
        package_manager: null
    },

    {
        id: 103, sym: "Dl", name: "Datalog", cat: "logic", year: 1977, paradigm: "Logic · Database queries",
        desc: "A subset of Prolog for database queries and program analysis. Pure declarative logic without function symbols. Used in static analysis tools, security research, and knowledge graphs.",
        links: {
            wiki: "https://en.wikipedia.org/wiki/Datalog",
            docs: "https://docs.racket-lang.org/datalog/",
            playground: "https://www.swi-prolog.org/pldoc/man?section=datalog",
            github: "https://github.com/souffle-lang/souffle"
        },
        tutorials: [{name: "Datalog Overview", url: "https://en.wikipedia.org/wiki/Datalog"}, {
            name: "Datomic Datalog",
            url: "https://docs.datomic.com/query/query-data-reference.html"
        }, {
            "name": "Soufflé Datalog",
            "url": "https://souffle-lang.github.io/tutorial"
        }, {"name": "CodeQL (uses Datalog)", "url": "https://codeql.github.com/docs/ql-language-reference/"}],
        frameworks: [],
        tools: [{
            name: "Soufflé",
            url: "https://souffle-lang.github.io/",
            desc: "High-performance Datalog"
        }, {name: "Semmlecode", url: "https://codeql.github.com/", desc: "CodeQL uses Datalog"}],
        packages: [{name: "Datomic", url: "https://www.datomic.com/", desc: "Immutable database using Datalog"}],
        package_manager: null
    },

    {
        id: 104, sym: "Cu", name: "Curry", cat: "logic", year: 1995, paradigm: "Functional · Logic",
        desc: "Integration of functional and logic programming. Non-determinism and constraint solving combined with Haskell-like functional syntax. Unifies two major programming paradigms.",
        links: {
            official: "https://curry-lang.org/",
            wiki: "https://en.wikipedia.org/wiki/Curry_(programming_language)",
            docs: "https://curry-lang.org/documentation.html",
            github: "https://git.ps.informatik.uni-kiel.de/curry",
            playground: "https://www.informatik.uni-kiel.de/~curry/tools/"
        },
        tutorials: [{
            name: "Curry Tutorial",
            url: "https://curry-lang.org/documentation.html"
        }, {
            name: "Introduction to Curry",
            url: "https://www.informatik.uni-kiel.de/~curry/tutorial/"
        }, {
            "name": "Curry Tutorial",
            "url": "https://www.informatik.uni-kiel.de/~curry/tutorial/"
        }, {"name": "Rosetta Code Curry", "url": "https://rosettacode.org/wiki/Category:Curry"}],
        frameworks: [],
        tools: [{
            name: "PAKCS",
            url: "https://www.informatik.uni-kiel.de/~pakcs/",
            desc: "Primary Curry implementation"
        }, {name: "KiCS2", url: "https://www-ps.informatik.uni-kiel.de/kics2/", desc: "Efficient native Curry"}],
        packages: [],
        package_manager: {name: "CPM (Curry Package Manager)", url: "https://www-ps.informatik.uni-kiel.de/~cpm/"}
    },

    {
        id: 105, sym: "Oz", name: "Oz", cat: "logic", year: 1991, paradigm: "Multi-paradigm · Concurrent",
        desc: "Supports constraint programming, logic, functional, and OOP all in one language. The Mozart platform implements Oz and is used for research in concurrent and distributed systems.",
        links: {
            wiki: "https://en.wikipedia.org/wiki/Oz_(programming_language)",
            docs: "https://mozart.github.io/documentation/",
            official: "https://mozart.github.io/"
        },
        tutorials: [{
            name: "Concepts, Techniques, Models (CTM)",
            url: "https://www.info.ucl.ac.be/~pvr/book.html"
        }, {name: "Mozart/Oz Tutorial", url: "https://mozart.github.io/mogul/"}, {
            "name": "Mozart/Oz Platform",
            "url": "https://mozart.github.io/"
        }, {"name": "CTM Textbook", "url": "https://www.info.ucl.ac.be/~pvr/book.html"}],
        frameworks: [],
        tools: [{name: "Mozart", url: "https://mozart.github.io/", desc: "Oz implementation platform"}],
        packages: [],
        package_manager: null
    },

    {
        id: 106, sym: "Mg", name: "miniKanren", cat: "logic", year: 2005, paradigm: "Logic · Relational",
        desc: "Logic programming micro-kernel designed to be embedded in host languages. Only 3 core operators. Inspired core.logic in Clojure and ports to Scheme, Python, JavaScript, Haskell.",
        links: {
            official: "http://minikanren.org/",
            wiki: "https://en.wikipedia.org/wiki/MiniKanren",
            docs: "http://minikanren.org/",
            github: "https://github.com/miniKanren/miniKanren",
            playground: "http://io.livecode.ch/learn/webyrd/webmk"
        },
        tutorials: [{name: "miniKanren.org", url: "http://minikanren.org/"}, {
            name: "The Reasoned Schemer",
            url: "https://mitpress.mit.edu/9780262535519/"
        }, {name: "Try miniKanren", url: "http://minikanren.org/"}, {
            "name": "miniKanren Online",
            "url": "http://io.livecode.ch/learn/webyrd/webmk"
        }, {"name": "Rosetta Code miniKanren", "url": "https://rosettacode.org/wiki/Category:MiniKanren"}],
        frameworks: [],
        tools: [],
        packages: [{
            name: "core.logic",
            url: "https://github.com/clojure/core.logic",
            desc: "Clojure miniKanren"
        }, {name: "micro-logic", url: "https://github.com/mullr/micrologic", desc: "Clojure implementation"}],
        package_manager: null
    },

    // ── GENERAL-PURPOSE ──────────────────────────────────────────────
    {
        id: 107, sym: "Bs", name: "BASIC", cat: "general", year: 1964, paradigm: "Procedural · Educational",
        desc: "Beginner's All-purpose Symbolic Instruction Code. The first language for millions of people in the 1980s. Line numbers, GOTO, and PRINT 'HELLO WORLD'. Foundational for a generation.",
        links: {
            wiki: "https://en.wikipedia.org/wiki/BASIC",
            docs: "https://www.qbasic.net/",
            playground: "https://www.jdoodle.com/execute-freebasic-online/",
            reddit: "https://www.reddit.com/r/BasicProgramming/"
        },
        tutorials: [{name: "QBasic Tutorial", url: "https://www.qbasic.net/"}, {
            name: "BASIC History",
            url: "https://en.wikipedia.org/wiki/BASIC"
        }, {name: "TI-Basic", url: "https://tibasicdev.wikidot.com/"}, {
            "name": "QB64",
            "url": "https://qb64.com/"
        }, {"name": "Rosetta Code BASIC", "url": "https://rosettacode.org/wiki/Category:BASIC"}],
        frameworks: [],
        tools: [{name: "QBasic", url: "https://www.qbasic.net/", desc: "Classic BASIC environment"}, {
            name: "FreeBASIC",
            url: "https://www.freebasic.net/",
            desc: "Modern BASIC compiler"
        }, {name: "GW-BASIC", url: "https://github.com/microsoft/GW-BASIC", desc: "Microsoft's open-sourced BASIC"}],
        packages: [],
        package_manager: null
    },

    {
        id: 108, sym: "Vb", name: "Visual Basic", cat: "general", year: 1991, paradigm: "Event-driven · OOP",
        desc: "Rapid application development for Windows. Introduced millions of developers to GUI programming in the 90s. VB.NET is its modern evolution on .NET.",
        links: {
            official: "https://learn.microsoft.com/en-us/dotnet/visual-basic/",
            wiki: "https://en.wikipedia.org/wiki/Visual_Basic_(.NET)",
            docs: "https://learn.microsoft.com/en-us/dotnet/visual-basic/",
            playground: "https://dotnetfiddle.net/",
            reddit: "https://www.reddit.com/r/vb/"
        },
        tutorials: [{
            name: "VB.NET Getting Started",
            url: "https://learn.microsoft.com/en-us/dotnet/visual-basic/getting-started/"
        }, {name: "VB Tutorial", url: "https://www.tutorialspoint.com/vb.net/"}, {
            "name": "VB.NET Tutorial",
            "url": "https://www.tutorialspoint.com/vb.net/"
        }, {"name": "DevDocs VB.NET", "url": "https://devdocs.io/"}],
        frameworks: [{
            name: "WinForms",
            url: "https://learn.microsoft.com/en-us/dotnet/desktop/winforms/",
            desc: "Windows desktop UI"
        }],
        tools: [],
        packages: [{name: ".NET", url: "https://dotnet.microsoft.com/", desc: ".NET runtime & libraries"}],
        package_manager: {name: "NuGet", url: "https://www.nuget.org/"}
    },

    {
        id: 109, sym: "Vv", name: "VBA", cat: "general", year: 1993, paradigm: "Scripting · Automation",
        desc: "Microsoft Office macro language for automating Excel, Word, Access, and Outlook. Ubiquitous in finance and business for spreadsheet automation. Runs inside Office products.",
        links: {
            official: "https://learn.microsoft.com/en-us/office/vba/library-reference/",
            wiki: "https://en.wikipedia.org/wiki/Visual_Basic_for_Applications",
            docs: "https://learn.microsoft.com/en-us/office/vba/api/overview/",
            playground: "https://www.onlinegdb.com/online_vb_compiler",
            reddit: "https://www.reddit.com/r/excel/"
        },
        tutorials: [{
            name: "Excel VBA Tutorial",
            url: "https://www.excel-easy.com/vba.html"
        }, {
            name: "Microsoft VBA Docs",
            url: "https://learn.microsoft.com/en-us/office/vba/api/overview/"
        }, {name: "Chandoo.org", url: "https://chandoo.org/wp/vba-tutorial/"}, {
            "name": "Excel Macro Tutorial",
            "url": "https://www.excel-easy.com/vba.html"
        }, {"name": "VBA Cheatsheet", "url": "https://devhints.io/vba"}],
        frameworks: [],
        tools: [],
        packages: [],
        package_manager: null
    },

    {
        id: 110, sym: "Sr", name: "Scratch", cat: "general", year: 2003, paradigm: "Visual · Block-based",
        desc: "MIT's visual block-based programming language for children. Drag-and-drop coding with instant feedback. 100M+ projects shared on Scratch.mit.edu. Used by 60M+ kids worldwide.",
        links: {
            official: "https://scratch.mit.edu/",
            wiki: "https://en.wikipedia.org/wiki/Scratch_(programming_language)",
            docs: "https://scratch-wiki.info/",
            playground: "https://scratch.mit.edu/projects/editor/",
            github: "https://github.com/scratchfoundation/scratch-gui",
            reddit: "https://www.reddit.com/r/scratch/"
        },
        tutorials: [{name: "Scratch Tutorial", url: "https://scratch.mit.edu/projects/editor/"}, {
            name: "Scratch Wiki",
            url: "https://en.scratch-wiki.info/"
        }, {
            name: "Code Club Scratch",
            url: "https://projects.raspberrypi.org/en/scratch"
        }, {"name": "CS First (Google)", "url": "https://csfirst.withgoogle.com/"}, {
            "name": "Raspberry Pi Scratch",
            "url": "https://projects.raspberrypi.org/en/scratch"
        }],
        frameworks: [],
        tools: [],
        packages: [],
        package_manager: null
    },

    {
        id: 111, sym: "Lg", name: "Logo", cat: "general", year: 1967, paradigm: "Educational · Functional",
        desc: "Turtle graphics language that made programming tangible for generations of children. Move a turtle around the screen with commands. Developed at MIT by Seymour Papert.",
        links: {
            wiki: "https://en.wikipedia.org/wiki/Logo_(programming_language)",
            docs: "https://el.media.mit.edu/logo-foundation/",
            playground: "https://turtleacademy.com/",
            reddit: "https://www.reddit.com/r/learnprogramming/"
        },
        tutorials: [{name: "Logo Foundation", url: "https://el.media.mit.edu/logo-foundation/"}, {
            name: "FMSLogo",
            url: "https://fmslogo.sourceforge.io/"
        }, {name: "Turtle Academy", url: "https://turtleacademy.com/"}, {
            "name": "Turtle Academy",
            "url": "https://turtleacademy.com/"
        }, {"name": "Rosetta Code Logo", "url": "https://rosettacode.org/wiki/Category:Logo"}],
        frameworks: [],
        tools: [{
            name: "NetLogo",
            url: "https://ccl.northwestern.edu/netlogo/",
            desc: "Agent-based modeling"
        }, {name: "UCBLogo", url: "https://people.eecs.berkeley.edu/~bh/logo.html", desc: "Berkeley Logo"}],
        packages: [],
        package_manager: null
    },

    {
        id: 112, sym: "Lx", name: "LaTeX", cat: "general", year: 1985, paradigm: "Markup · Typesetting",
        desc: "Document preparation system for scientific papers, theses, and books. The standard for academic publishing worldwide — every major journal accepts or requires LaTeX.",
        links: {
            official: "https://www.latex-project.org/",
            wiki: "https://en.wikipedia.org/wiki/LaTeX",
            docs: "https://www.latex-project.org/help/documentation/",
            github: "https://github.com/latex3/latex2e",
            playground: "https://www.overleaf.com/",
            reddit: "https://www.reddit.com/r/LaTeX/"
        },
        tutorials: [{name: "Overleaf Learn", url: "https://www.overleaf.com/learn"}, {
            name: "LaTeX Tutorial",
            url: "https://www.latex-tutorial.com/"
        }, {name: "Learn LaTeX.org", url: "https://www.learnlatex.org/"}, {
            "name": "Detexify",
            "url": "https://detexify.kirelabs.org/"
        }, {"name": "LaTeX Cheatsheet", "url": "https://wch.github.io/latexsheet/"}],
        frameworks: [],
        tools: [{
            name: "Overleaf",
            url: "https://www.overleaf.com/",
            desc: "Collaborative LaTeX editor"
        }, {name: "BibTeX", url: "https://www.bibtex.org/", desc: "Bibliography management"}],
        packages: [{name: "TikZ", url: "https://pgf-tikz.github.io/", desc: "Powerful diagrams & graphics"}],
        package_manager: {name: "CTAN / TeX Live / tlmgr", url: "https://www.ctan.org/"}
    },

    {
        id: 113, sym: "Po", name: "PostScript", cat: "general", year: 1982, paradigm: "Stack-based · Page description",
        desc: "Stack-based page description language created by Adobe. Defined the modern printing industry — every laser printer speaks PostScript. PDF is directly descended from it.",
        links: {
            wiki: "https://en.wikipedia.org/wiki/PostScript",
            docs: "https://www.adobe.com/content/dam/acom/en/devnet/actionscript/articles/psrefman.pdf",
            official: "https://www.adobe.com/products/postscript.html",
            playground: "https://www.ghostscript.com/"
        },
        tutorials: [{
            name: "PostScript Tutorial",
            url: "https://www.math.ubc.ca/~cass/graphics/manual/pdf/a1.pdf"
        }, {
            name: "Adobe PostScript",
            url: "https://www.adobe.com/products/postscript.html"
        }, {
            "name": "PostScript Tutorial",
            "url": "https://www.math.ubc.ca/~cass/graphics/manual/pdf/a1.pdf"
        }, {"name": "Rosetta Code PostScript", "url": "https://rosettacode.org/wiki/Category:PostScript"}],
        frameworks: [],
        tools: [{
            name: "Ghostscript",
            url: "https://www.ghostscript.com/",
            desc: "PostScript/PDF interpreter"
        }, {name: "ImageMagick", url: "https://imagemagick.org/", desc: "Uses PostScript internally"}],
        packages: [],
        package_manager: null
    },

    {
        id: 114, sym: "Rp", name: "RPG", cat: "general", year: 1959, paradigm: "Business · Report",
        desc: "Report Program Generator. IBM's language for AS/400 and IBM i mainframes. Still runs critical banking, insurance, and government logic worldwide — billions in daily transactions.",
        links: {
            wiki: "https://en.wikipedia.org/wiki/IBM_RPG",
            docs: "https://www.ibm.com/docs/en/rdp",
            official: "https://www.ibm.com/products/rpg",
            reddit: "https://www.reddit.com/r/IBMi/"
        },
        tutorials: [{name: "IBM RPG Guide", url: "https://www.ibm.com/docs/en/rdp"}, {
            name: "RPGpgm.com",
            url: "https://rpgpgm.com/"
        }, {
            name: "IBM i Community",
            url: "https://www.ibm.com/community/user/ibmz-and-linuxone/communities/community-home"
        }, {"name": "IBM i Community", "url": "https://www.ibm.com/community/user/power"}, {
            "name": "RPGPGM",
            "url": "https://rpgpgm.com/"
        }],
        frameworks: [],
        tools: [{
            name: "IBM i",
            url: "https://www.ibm.com/it-infrastructure/power/os/ibm-i",
            desc: "IBM AS/400 successor OS"
        }],
        packages: [],
        package_manager: null
    },

    {
        id: 115, sym: "Vl", name: "Vale", cat: "general", year: 2019, paradigm: "Systems · Memory-safe",
        desc: "Memory safety without borrow checker or garbage collector. Uses generational references for zero-cost safety at runtime. Aims to be easier than Rust without losing safety.",
        links: {
            official: "https://vale.dev/",
            wiki: "https://en.wikipedia.org/wiki/Vale_(programming_language)",
            docs: "https://vale.dev/guide/introduction",
            github: "https://github.com/ValeLang/Vale",
            reddit: "https://www.reddit.com/r/ProgrammingLanguages/"
        },
        tutorials: [{name: "Vale Guide", url: "https://vale.dev/guide/introduction"}, {
            name: "Vale Blog",
            url: "https://vale.dev/blog/"
        }, {"name": "Vale Blog", "url": "https://vale.dev/blog/"}, {
            "name": "Vale Discord",
            "url": "https://discord.gg/SNB8yGH"
        }],
        frameworks: [],
        tools: [],
        packages: [],
        package_manager: null
    },

    // ── HARDWARE ─────────────────────────────────────────────────────
    {
        id: 116, sym: "Vh", name: "VHDL", cat: "hardware", year: 1980, paradigm: "HDL · Concurrent",
        desc: "VHSIC Hardware Description Language. FPGA programming and ASIC design in aerospace, defense, and telecommunications. Developed by the US DoD for standardized hardware description.",
        links: {
            wiki: "https://en.wikipedia.org/wiki/VHDL",
            docs: "https://www.ics.uci.edu/~jmoorkan/vhdlref/",
            spec: "https://ieeexplore.ieee.org/document/8938196",
            playground: "https://www.edaplayground.com/",
            reddit: "https://www.reddit.com/r/VHDL/"
        },
        tutorials: [{name: "VHDL Tutorial", url: "https://www.ics.uci.edu/~jmoorkan/vhdlref/"}, {
            name: "VHDL Basics",
            url: "https://www.nandland.com/vhdl/tutorials/"
        }, {name: "FPGA4Fun", url: "https://www.fpga4fun.com/"}, {
            "name": "EDA Playground",
            "url": "https://www.edaplayground.com/"
        }, {"name": "VHDL Cheatsheet", "url": "https://www.nandland.com/vhdl/tutorials/"}],
        frameworks: [],
        tools: [{
            name: "GHDL",
            url: "https://github.com/ghdl/ghdl",
            desc: "Open-source VHDL simulator"
        }, {
            name: "ModelSim",
            url: "https://www.mentor.com/products/fv/modelsim/",
            desc: "Simulation & verification"
        }, {
            name: "Vivado",
            url: "https://www.xilinx.com/products/design-tools/vivado.html",
            desc: "Xilinx FPGA design suite"
        }],
        packages: [],
        package_manager: null
    },

    {
        id: 117, sym: "Ve", name: "Verilog", cat: "hardware", year: 1984, paradigm: "HDL · Concurrent",
        desc: "Industry-standard hardware description language for digital circuit design and verification. More widely adopted than VHDL in industry, especially in the US and Asia.",
        links: {
            wiki: "https://en.wikipedia.org/wiki/Verilog",
            docs: "https://www.asic-world.com/verilog/veritut.html",
            spec: "https://ieeexplore.ieee.org/document/1620780",
            playground: "https://www.edaplayground.com/",
            github: "https://github.com/steveicarus/iverilog",
            reddit: "https://www.reddit.com/r/FPGA/"
        },
        tutorials: [{
            name: "ASIC World Verilog",
            url: "https://www.asic-world.com/verilog/veritut.html"
        }, {name: "Nandland Verilog", url: "https://www.nandland.com/verilog/tutorials/"}, {
            name: "HDLbits",
            url: "https://hdlbits.01xz.net/wiki/Main_Page"
        }, {"name": "HDLBits", "url": "https://hdlbits.01xz.net/wiki/Main_Page"}, {
            "name": "EDA Playground",
            "url": "https://www.edaplayground.com/"
        }],
        frameworks: [],
        tools: [{
            name: "Icarus Verilog",
            url: "http://iverilog.icarus.com/",
            desc: "Open-source Verilog simulator"
        }, {
            name: "Verilator",
            url: "https://www.veripool.org/verilator/",
            desc: "Fast Verilog simulator"
        }, {
            name: "Xilinx Vivado",
            url: "https://www.xilinx.com/products/design-tools/vivado.html",
            desc: "FPGA design suite"
        }],
        packages: [],
        package_manager: null
    },

    {
        id: 118, sym: "Sv", name: "SystemVerilog", cat: "hardware", year: 2002, paradigm: "HDL · Verification",
        desc: "Extended Verilog with object-oriented features for hardware design AND verification. The industry standard for functional verification — used by Intel, AMD, Nvidia, and ARM.",
        links: {
            wiki: "https://en.wikipedia.org/wiki/SystemVerilog",
            docs: "https://www.systemverilog.io/",
            spec: "https://ieeexplore.ieee.org/document/8299595",
            playground: "https://www.edaplayground.com/",
            reddit: "https://www.reddit.com/r/FPGA/"
        },
        tutorials: [{name: "SystemVerilog.io", url: "https://www.systemverilog.io/"}, {
            name: "ChipVerify",
            url: "https://www.chipverify.com/systemverilog/systemverilog-tutorial"
        }, {name: "HDLbits", url: "https://hdlbits.01xz.net/wiki/Problem_sets"}, {
            "name": "ChipVerify SV",
            "url": "https://www.chipverify.com/systemverilog/systemverilog-tutorial"
        }, {"name": "EDA Playground", "url": "https://www.edaplayground.com/"}],
        frameworks: [],
        tools: [{
            name: "VCS",
            url: "https://www.synopsys.com/verification/simulation/vcs.html",
            desc: "Synopsys simulator"
        }],
        packages: [{
            name: "UVM",
            url: "https://www.accellera.org/downloads/standards/uvm",
            desc: "Universal Verification Methodology"
        }],
        package_manager: null
    },

    {
        id: 119, sym: "Ci", name: "Chisel", cat: "hardware", year: 2012, paradigm: "HDL · Functional · Scala",
        desc: "Hardware Construction Language embedded in Scala. Generates Verilog from Scala programs. Powers RISC-V processor designs at Berkeley and used by Google, SiFive, and Western Digital.",
        links: {
            official: "https://www.chisel-lang.org/",
            wiki: "https://en.wikipedia.org/wiki/Chisel_(programming_language)",
            docs: "https://www.chisel-lang.org/chisel3/docs/",
            github: "https://github.com/chipsalliance/chisel",
            playground: "https://github.com/freechipsproject/chisel-bootcamp",
            reddit: "https://www.reddit.com/r/RISCV/"
        },
        tutorials: [{
            name: "Chisel Bootcamp",
            url: "https://github.com/freechipsproject/chisel-bootcamp"
        }, {name: "Chisel Docs", url: "https://www.chisel-lang.org/chisel3/docs/"}, {
            name: "Digital Design with Chisel",
            url: "http://www.imm.dtu.dk/~masca/chisel-book.html"
        }, {
            "name": "Chisel Bootcamp (Colab)",
            "url": "https://github.com/freechipsproject/chisel-bootcamp"
        }, {"name": "RISC-V Foundation", "url": "https://riscv.org/"}],
        frameworks: [{
            name: "Rocket Chip",
            url: "https://github.com/chipsalliance/rocket-chip",
            desc: "RISC-V SoC generator"
        }],
        tools: [{name: "FIRRTL", url: "https://github.com/chipsalliance/firrtl", desc: "Hardware IR"}],
        packages: [],
        package_manager: {name: "sbt", url: "https://www.scala-sbt.org/"}
    },

    {
        id: 120, sym: "Mf", name: "Migen", cat: "hardware", year: 2011, paradigm: "HDL · Python DSL",
        desc: "Python-based toolbox for digital hardware design that compiles to Verilog. Makes FPGA design accessible to Python programmers. Used in LiteX SoC builder.",
        links: {
            official: "https://m-labs.hk/migen/",
            wiki: "https://en.wikipedia.org/wiki/Migen",
            docs: "https://m-labs.hk/migen/manual/",
            github: "https://github.com/m-labs/migen"
        },
        tutorials: [{name: "Migen Manual", url: "https://m-labs.hk/migen/manual/"}, {
            name: "LiteX Tutorial",
            url: "https://github.com/enjoy-digital/litex/wiki/Tutorials-Resources"
        }, {"name": "LiteX SoC Builder", "url": "https://github.com/enjoy-digital/litex"}, {
            "name": "Migen Manual",
            "url": "https://m-labs.hk/migen/manual/"
        }],
        frameworks: [{name: "LiteX", url: "https://github.com/enjoy-digital/litex", desc: "SoC builder framework"}],
        tools: [],
        packages: [{name: "LiteEth", url: "https://github.com/enjoy-digital/liteeth", desc: "Ethernet core"}],
        package_manager: {name: "pip", url: "https://pypi.org/project/migen/"}
    },
];