Module.version_number = Module.cwrap("archive_version_number", "number", []);
Module.version_string = Module.cwrap("archive_version_string", "string", []);
Module.entry_new = Module.cwrap("archive_entry_new", "number", []);
Module.entry_clear = Module.cwrap("archive_entry_clear", "number", ["number"]);
Module.entry_clone = Module.cwrap("archive_entry_clone", "number", ["number"]);
Module.entry_free = Module.cwrap("archive_entry_free", null, ["number"]);
Module.malloc = Module.cwrap("malloc", "number", ["number"]);
Module.free = Module.cwrap("free", null, ["number"]);