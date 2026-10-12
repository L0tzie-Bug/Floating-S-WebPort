var Module = typeof Module != 'undefined' ? Module : {};

  if (!Module.expectedDataFileDownloads) {
    Module.expectedDataFileDownloads = 0;
  }

  Module.expectedDataFileDownloads++;
  (function() {

    if (Module['ENVIRONMENT_IS_PTHREAD'] || Module['$ww']) return;
    var loadPackage = function(metadata) {

      var PACKAGE_PATH = '';
      if (typeof window === 'object') {
        PACKAGE_PATH = window['encodeURIComponent'](window.location.pathname.toString().substring(0, window.location.pathname.toString().lastIndexOf('/')) + '/');
      } else if (typeof process === 'undefined' && typeof location !== 'undefined') {

        PACKAGE_PATH = encodeURIComponent(location.pathname.toString().substring(0, location.pathname.toString().lastIndexOf('/')) + '/');
      }
      var PACKAGE_NAME = 'index.data';
      var REMOTE_PACKAGE_BASE = 'index.data';
      if (typeof Module['locateFilePackage'] === 'function' && !Module['locateFile']) {
        Module['locateFile'] = Module['locateFilePackage'];
        err('warning: you defined Module.locateFilePackage, that has been renamed to Module.locateFile (using your locateFilePackage for now)');
      }
      var REMOTE_PACKAGE_NAME = Module['locateFile'] ? Module['locateFile'](REMOTE_PACKAGE_BASE, '') : REMOTE_PACKAGE_BASE;
var REMOTE_PACKAGE_SIZE = metadata['remote_package_size'];

      function fetchRemotePackage(packageName, packageSize, callback, errback) {

        var xhr = new XMLHttpRequest();
        xhr.open('GET', packageName, true);
        xhr.responseType = 'arraybuffer';
        xhr.onprogress = function(event) {
          var url = packageName;
          var size = packageSize;
          if (event.total) size = event.total;
          if (event.loaded) {
            if (!xhr.addedTotal) {
              xhr.addedTotal = true;
              if (!Module.dataFileDownloads) Module.dataFileDownloads = {};
              Module.dataFileDownloads[url] = {
                loaded: event.loaded,
                total: size
              };
            } else {
              Module.dataFileDownloads[url].loaded = event.loaded;
            }
            var total = 0;
            var loaded = 0;
            var num = 0;
            for (var download in Module.dataFileDownloads) {
            var data = Module.dataFileDownloads[download];
              total += data.total;
              loaded += data.loaded;
              num++;
            }
            total = Math.ceil(total * Module.expectedDataFileDownloads/num);
            if (Module['setStatus']) Module['setStatus'](`Downloading data... (${loaded}/${total})`);
          } else if (!Module.dataFileDownloads) {
            if (Module['setStatus']) Module['setStatus']('Downloading data...');
          }
        };
        xhr.onerror = function(event) {
          throw new Error("NetworkError for: " + packageName);
        }
        xhr.onload = function(event) {
          if (xhr.status == 200 || xhr.status == 304 || xhr.status == 206 || (xhr.status == 0 && xhr.response)) {
            var packageData = xhr.response;
            callback(packageData);
          } else {
            throw new Error(xhr.statusText + " : " + xhr.responseURL);
          }
        };
        xhr.send(null);
      };

      function handleError(error) {
        console.error('package error:', error);
      };

      var fetchedCallback = null;
      var fetched = Module['getPreloadedPackage'] ? Module['getPreloadedPackage'](REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE) : null;

      if (!fetched) fetchRemotePackage(REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE, function(data) {
        if (fetchedCallback) {
          fetchedCallback(data);
          fetchedCallback = null;
        } else {
          fetched = data;
        }
      }, handleError);

    function runWithFS() {

      function assert(check, msg) {
        if (!check) throw msg + new Error().stack;
      }
Module['FS_createPath']("/", "game", true, true);
Module['FS_createPath']("/game", "Data", true, true);
Module['FS_createPath']("/game/Data", "Built-in Ships", true, true);
Module['FS_createPath']("/game/Data", "Fonts", true, true);
Module['FS_createPath']("/game/Data/Fonts", "Game", true, true);
Module['FS_createPath']("/game/Data", "Misc", true, true);
Module['FS_createPath']("/game/Data", "Resources", true, true);
Module['FS_createPath']("/game/Data", "Shaders", true, true);
Module['FS_createPath']("/game/Data/Shaders", "GPUCalc", true, true);
Module['FS_createPath']("/game/Data/Shaders", "Game", true, true);
Module['FS_createPath']("/game/Data/Shaders", "ShipBuilder", true, true);
Module['FS_createPath']("/game/Data", "Textures", true, true);
Module['FS_createPath']("/game/Data/Textures", "Atlases", true, true);
Module['FS_createPath']("/game/Data/Textures", "Fish", true, true);
Module['FS_createPath']("/game/Data/Textures", "GenericLinearTexture", true, true);
Module['FS_createPath']("/game/Data/Textures", "GenericMipMappedTexture", true, true);
Module['FS_createPath']("/game/Data/Textures", "Material", true, true);
Module['FS_createPath']("/game/Data/Textures", "Noise", true, true);
Module['FS_createPath']("/game/Data/Textures", "ShipBuilderMipMappedTexture", true, true);
Module['FS_createPath']("/game/Data/Textures", "ShipEnhancements", true, true);
Module['FS_createPath']("/game/Data/Textures", "World", true, true);

      function DataRequest(start, end, audio) {
        this.start = start;
        this.end = end;
        this.audio = audio;
      }
      DataRequest.prototype = {
        requests: {},
        open: function(mode, name) {
          this.name = name;
          this.requests[name] = this;
          Module['addRunDependency'](`fp ${this.name}`);
        },
        send: function() {},
        onload: function() {
          var byteArray = this.byteArray.subarray(this.start, this.end);
          this.finish(byteArray);
        },
        finish: function(byteArray) {
          var that = this;

          Module['FS_createDataFile'](this.name, null, byteArray, true, true, true);
          Module['removeRunDependency'](`fp ${that.name}`);
          this.requests[this.name] = null;
        }
      };

      var files = metadata['files'];
      for (var i = 0; i < files.length; ++i) {
        new DataRequest(files[i]['start'], files[i]['end'], files[i]['audio'] || 0).open('GET', files[i]['filename']);
      }

      function processPackageData(arrayBuffer) {
        assert(arrayBuffer, 'Loading data file failed.');
        assert(arrayBuffer.constructor.name === ArrayBuffer.name, 'bad input to processPackageData');
        var byteArray = new Uint8Array(arrayBuffer);
        var curr;

          DataRequest.prototype.byteArray = byteArray;
          var files = metadata['files'];
          for (var i = 0; i < files.length; ++i) {
            DataRequest.prototype.requests[files[i].filename].onload();
          }          Module['removeRunDependency']('datafile_index.data');

      };
      Module['addRunDependency']('datafile_index.data');

      if (!Module.preloadResults) Module.preloadResults = {};

      Module.preloadResults[PACKAGE_NAME] = {fromCache: false};
      if (fetched) {
        processPackageData(fetched);
        fetched = null;
      } else {
        fetchedCallback = processPackageData;
      }

    }
    if (Module['calledRun']) {
      runWithFS();
    } else {
      if (!Module['preRun']) Module['preRun'] = [];
      Module["preRun"].push(runWithFS);
    }

    }
    loadPackage({"files": [{"filename": "/game/Data/Built-in Ships/Floating Sandbox Logo.shp", "start": 0, "end": 165}, {"filename": "/game/Data/Built-in Ships/R.M.S. Titanic (on Holidays).shp", "start": 165, "end": 701}, {"filename": "/game/Data/Built-in Ships/fallback_ship.shp2", "start": 701, "end": 9346}, {"filename": "/game/Data/Built-in Ships/fs_logo_structure.png.dat", "start": 9346, "end": 9585}, {"filename": "/game/Data/Built-in Ships/fs_logo_texture.png.dat", "start": 9585, "end": 23147}, {"filename": "/game/Data/Built-in Ships/rms_titanic_holidays_electrical.png.dat", "start": 23147, "end": 26517}, {"filename": "/game/Data/Built-in Ships/rms_titanic_holidays_ropes.png.dat", "start": 26517, "end": 29756}, {"filename": "/game/Data/Built-in Ships/rms_titanic_holidays_structure.png.dat", "start": 29756, "end": 34624}, {"filename": "/game/Data/Built-in Ships/rms_titanic_holidays_texture.png.dat", "start": 34624, "end": 725114}, {"filename": "/game/Data/Fonts/Game/Font0.bff", "start": 725114, "end": 987534}, {"filename": "/game/Data/Fonts/Game/Font1.bff", "start": 987534, "end": 1249954}, {"filename": "/game/Data/Fonts/Game/SevenSegments.bff", "start": 1249954, "end": 1512374}, {"filename": "/game/Data/Misc/default_ocean_floor_height_map.png", "start": 1512374, "end": 1516360}, {"filename": "/game/Data/Misc/fish_species.json", "start": 1516360, "end": 1518847}, {"filename": "/game/Data/Misc/materials_electrical.json", "start": 1518847, "end": 1597928}, {"filename": "/game/Data/Misc/materials_structural.json", "start": 1597928, "end": 1780073}, {"filename": "/game/Data/Misc/npcs.json", "start": 1780073, "end": 1845331}, {"filename": "/game/Data/Misc/ship_name_prefixes.txt", "start": 1845331, "end": 1847478}, {"filename": "/game/Data/Resources/add_furniture_npc_group_icon.png", "start": 1847478, "end": 1848169}, {"filename": "/game/Data/Resources/add_furniture_npc_icon.png", "start": 1848169, "end": 1848932}, {"filename": "/game/Data/Resources/add_human_npc_group_icon.png", "start": 1848932, "end": 1850382}, {"filename": "/game/Data/Resources/add_human_npc_icon.png", "start": 1850382, "end": 1851506}, {"filename": "/game/Data/Resources/air_tank_cursor_down.png", "start": 1851506, "end": 1855723}, {"filename": "/game/Data/Resources/air_tank_cursor_up.png", "start": 1855723, "end": 1859940}, {"filename": "/game/Data/Resources/am_bomb_cursor.png", "start": 1859940, "end": 1864157}, {"filename": "/game/Data/Resources/anti_gravity_field_cursor.png", "start": 1864157, "end": 1864829}, {"filename": "/game/Data/Resources/arrow_down_medium.png", "start": 1864829, "end": 1866875}, {"filename": "/game/Data/Resources/arrow_up_medium.png", "start": 1866875, "end": 1868910}, {"filename": "/game/Data/Resources/auto_texturization_material.png", "start": 1868910, "end": 1870179}, {"filename": "/game/Data/Resources/auto_texturization_particle.png", "start": 1870179, "end": 1870658}, {"filename": "/game/Data/Resources/autofocus_on_npc_cursor.png", "start": 1870658, "end": 1871244}, {"filename": "/game/Data/Resources/autofocus_on_npc_icon.png", "start": 1871244, "end": 1872884}, {"filename": "/game/Data/Resources/automatic_switch_off_disabled.png", "start": 1872884, "end": 1877156}, {"filename": "/game/Data/Resources/automatic_switch_off_enabled.png", "start": 1877156, "end": 1880331}, {"filename": "/game/Data/Resources/automatic_switch_on_disabled.png", "start": 1880331, "end": 1884603}, {"filename": "/game/Data/Resources/automatic_switch_on_thermal_enabled.png", "start": 1884603, "end": 1888330}, {"filename": "/game/Data/Resources/automatic_switch_on_water_enabled.png", "start": 1888330, "end": 1892031}, {"filename": "/game/Data/Resources/autotexturization_mode_icon_small.png", "start": 1892031, "end": 1892610}, {"filename": "/game/Data/Resources/backup_ship_button.png", "start": 1892610, "end": 1893976}, {"filename": "/game/Data/Resources/blast_cursor_up_1.png", "start": 1893976, "end": 1895120}, {"filename": "/game/Data/Resources/blast_cursor_up_2.png", "start": 1895120, "end": 1898122}, {"filename": "/game/Data/Resources/chainsaw_cursor_down_1.png", "start": 1898122, "end": 1902339}, {"filename": "/game/Data/Resources/chainsaw_cursor_down_2.png", "start": 1902339, "end": 1906556}, {"filename": "/game/Data/Resources/chainsaw_cursor_up.png", "start": 1906556, "end": 1910773}, {"filename": "/game/Data/Resources/confirm_40x40.png", "start": 1910773, "end": 1911986}, {"filename": "/game/Data/Resources/copy_button.png", "start": 1911986, "end": 1914450}, {"filename": "/game/Data/Resources/corner_cursor.png", "start": 1914450, "end": 1914788}, {"filename": "/game/Data/Resources/crosshair_cursor.png", "start": 1914788, "end": 1917019}, {"filename": "/game/Data/Resources/crosshair_cursor_down.png", "start": 1917019, "end": 1919983}, {"filename": "/game/Data/Resources/crosshair_cursor_up.png", "start": 1919983, "end": 1922985}, {"filename": "/game/Data/Resources/cut_button.png", "start": 1922985, "end": 1926529}, {"filename": "/game/Data/Resources/delete_layer_button.png", "start": 1926529, "end": 1927196}, {"filename": "/game/Data/Resources/deselect_button.png", "start": 1927196, "end": 1928252}, {"filename": "/game/Data/Resources/drag_cursor_down_minus.png", "start": 1928252, "end": 1932469}, {"filename": "/game/Data/Resources/drag_cursor_down_plus.png", "start": 1932469, "end": 1936686}, {"filename": "/game/Data/Resources/drag_cursor_up_minus.png", "start": 1936686, "end": 1940903}, {"filename": "/game/Data/Resources/drag_cursor_up_plus.png", "start": 1940903, "end": 1945120}, {"filename": "/game/Data/Resources/electric_spark_cursor_down.png", "start": 1945120, "end": 1946007}, {"filename": "/game/Data/Resources/electric_spark_cursor_up.png", "start": 1946007, "end": 1947014}, {"filename": "/game/Data/Resources/electrical_layer.png", "start": 1947014, "end": 1949119}, {"filename": "/game/Data/Resources/electrical_panel_dock_pin_down.png", "start": 1949119, "end": 1954147}, {"filename": "/game/Data/Resources/electrical_panel_dock_pin_up.png", "start": 1954147, "end": 1959942}, {"filename": "/game/Data/Resources/electrical_panel_edit_element.png", "start": 1959942, "end": 1965532}, {"filename": "/game/Data/Resources/electrical_panel_edit_element_shadow.png", "start": 1965532, "end": 1966556}, {"filename": "/game/Data/Resources/electrical_panel_edit_medium.png", "start": 1966556, "end": 1967239}, {"filename": "/game/Data/Resources/empty_cursor.png", "start": 1967239, "end": 1967551}, {"filename": "/game/Data/Resources/eraser_cursor.png", "start": 1967551, "end": 1968293}, {"filename": "/game/Data/Resources/eraser_icon.png", "start": 1968293, "end": 1969020}, {"filename": "/game/Data/Resources/error_medium.png", "start": 1969020, "end": 1975042}, {"filename": "/game/Data/Resources/exterior_texture_layer.png", "start": 1975042, "end": 1976260}, {"filename": "/game/Data/Resources/fire_extinguisher_cursor_down.png", "start": 1976260, "end": 1980477}, {"filename": "/game/Data/Resources/fire_extinguisher_cursor_up.png", "start": 1980477, "end": 1984694}, {"filename": "/game/Data/Resources/fire_extinguishing_bomb_cursor.png", "start": 1984694, "end": 1986014}, {"filename": "/game/Data/Resources/flip_h_medium.png", "start": 1986014, "end": 1987821}, {"filename": "/game/Data/Resources/flip_h_small.png", "start": 1987821, "end": 1988959}, {"filename": "/game/Data/Resources/flip_v_medium.png", "start": 1988959, "end": 1990762}, {"filename": "/game/Data/Resources/flip_v_small.png", "start": 1990762, "end": 1991900}, {"filename": "/game/Data/Resources/flood_cursor_down_1.png", "start": 1991900, "end": 1996117}, {"filename": "/game/Data/Resources/flood_cursor_down_2.png", "start": 1996117, "end": 2000334}, {"filename": "/game/Data/Resources/flood_cursor_up.png", "start": 2000334, "end": 2004551}, {"filename": "/game/Data/Resources/flood_tool_cursor.png", "start": 2004551, "end": 2005676}, {"filename": "/game/Data/Resources/flood_tool_icon.png", "start": 2005676, "end": 2006703}, {"filename": "/game/Data/Resources/food_can_cursor_down_1.png", "start": 2006703, "end": 2008438}, {"filename": "/game/Data/Resources/food_can_cursor_down_2.png", "start": 2008438, "end": 2010168}, {"filename": "/game/Data/Resources/food_can_cursor_up.png", "start": 2010168, "end": 2011939}, {"filename": "/game/Data/Resources/game_visualization.png", "start": 2011939, "end": 2012707}, {"filename": "/game/Data/Resources/gauge_0-100.png", "start": 2012707, "end": 2023839}, {"filename": "/game/Data/Resources/gauge_jet.png", "start": 2023839, "end": 2036507}, {"filename": "/game/Data/Resources/gauge_rpm.png", "start": 2036507, "end": 2049881}, {"filename": "/game/Data/Resources/gauge_volts.png", "start": 2049881, "end": 2062207}, {"filename": "/game/Data/Resources/heat_blaster_cool_cursor_down.png", "start": 2062207, "end": 2066424}, {"filename": "/game/Data/Resources/heat_blaster_cool_cursor_up.png", "start": 2066424, "end": 2070641}, {"filename": "/game/Data/Resources/heat_blaster_heat_cursor_down.png", "start": 2070641, "end": 2074858}, {"filename": "/game/Data/Resources/heat_blaster_heat_cursor_up.png", "start": 2074858, "end": 2079075}, {"filename": "/game/Data/Resources/height_icon_small.png", "start": 2079075, "end": 2079409}, {"filename": "/game/Data/Resources/home.png", "start": 2079409, "end": 2080538}, {"filename": "/game/Data/Resources/home_user.png", "start": 2080538, "end": 2080881}, {"filename": "/game/Data/Resources/image_size_icon.png", "start": 2080881, "end": 2081280}, {"filename": "/game/Data/Resources/impact_bomb_cursor.png", "start": 2081280, "end": 2085497}, {"filename": "/game/Data/Resources/info.png", "start": 2085497, "end": 2086185}, {"filename": "/game/Data/Resources/interactive_push_switch_off_disabled.png", "start": 2086185, "end": 2091384}, {"filename": "/game/Data/Resources/interactive_push_switch_off_enabled.png", "start": 2091384, "end": 2095810}, {"filename": "/game/Data/Resources/interactive_push_switch_on_disabled.png", "start": 2095810, "end": 2100898}, {"filename": "/game/Data/Resources/interactive_push_switch_on_enabled.png", "start": 2100898, "end": 2105335}, {"filename": "/game/Data/Resources/interactive_toggle_switch_off_disabled.png", "start": 2105335, "end": 2109472}, {"filename": "/game/Data/Resources/interactive_toggle_switch_off_enabled.png", "start": 2109472, "end": 2116115}, {"filename": "/game/Data/Resources/interactive_toggle_switch_on_disabled.png", "start": 2116115, "end": 2120263}, {"filename": "/game/Data/Resources/interactive_toggle_switch_on_enabled.png", "start": 2120263, "end": 2126909}, {"filename": "/game/Data/Resources/invisible_icon_medium.png", "start": 2126909, "end": 2128131}, {"filename": "/game/Data/Resources/jet_throttle_background_disabled.png", "start": 2128131, "end": 2144337}, {"filename": "/game/Data/Resources/jet_throttle_background_enabled.png", "start": 2144337, "end": 2152236}, {"filename": "/game/Data/Resources/jet_throttle_handle_disabled.png", "start": 2152236, "end": 2156178}, {"filename": "/game/Data/Resources/jet_throttle_handle_enabled.png", "start": 2156178, "end": 2158454}, {"filename": "/game/Data/Resources/lamp_cursor_down.png", "start": 2158454, "end": 2159533}, {"filename": "/game/Data/Resources/lamp_cursor_up.png", "start": 2159533, "end": 2160439}, {"filename": "/game/Data/Resources/laser_cannon_icon.png", "start": 2160439, "end": 2161203}, {"filename": "/game/Data/Resources/lightning_cursor_and_icon.png", "start": 2161203, "end": 2162128}, {"filename": "/game/Data/Resources/line_icon.png", "start": 2162128, "end": 2162506}, {"filename": "/game/Data/Resources/lines_mode_icon_small.png", "start": 2162506, "end": 2164572}, {"filename": "/game/Data/Resources/load_random_ship_icon.png", "start": 2164572, "end": 2165143}, {"filename": "/game/Data/Resources/load_ship_button.png", "start": 2165143, "end": 2165796}, {"filename": "/game/Data/Resources/locked_horizontal_small.png", "start": 2165796, "end": 2166264}, {"filename": "/game/Data/Resources/locked_vertical_small.png", "start": 2166264, "end": 2166748}, {"filename": "/game/Data/Resources/magic_wand_cursor.png", "start": 2166748, "end": 2167394}, {"filename": "/game/Data/Resources/magic_wand_icon.png", "start": 2167394, "end": 2168070}, {"filename": "/game/Data/Resources/measuring_tape_cursor.png", "start": 2168070, "end": 2169865}, {"filename": "/game/Data/Resources/measuring_tape_icon.png", "start": 2169865, "end": 2171461}, {"filename": "/game/Data/Resources/measuring_tape_icon_small.png", "start": 2171461, "end": 2172434}, {"filename": "/game/Data/Resources/megaphone_cursor_down_1.png", "start": 2172434, "end": 2173672}, {"filename": "/game/Data/Resources/megaphone_cursor_down_2.png", "start": 2173672, "end": 2174891}, {"filename": "/game/Data/Resources/megaphone_cursor_up.png", "start": 2174891, "end": 2176000}, {"filename": "/game/Data/Resources/mesh_mode_icon_small.png", "start": 2176000, "end": 2176554}, {"filename": "/game/Data/Resources/metadata_button.png", "start": 2176554, "end": 2178208}, {"filename": "/game/Data/Resources/move_all_cursor_down.png", "start": 2178208, "end": 2182425}, {"filename": "/game/Data/Resources/move_all_cursor_rotate_down.png", "start": 2182425, "end": 2186642}, {"filename": "/game/Data/Resources/move_all_cursor_rotate_up.png", "start": 2186642, "end": 2190859}, {"filename": "/game/Data/Resources/move_all_cursor_up.png", "start": 2190859, "end": 2195076}, {"filename": "/game/Data/Resources/move_cursor_down.png", "start": 2195076, "end": 2199293}, {"filename": "/game/Data/Resources/move_cursor_rotate_down.png", "start": 2199293, "end": 2203510}, {"filename": "/game/Data/Resources/move_cursor_rotate_up.png", "start": 2203510, "end": 2207727}, {"filename": "/game/Data/Resources/move_cursor_up.png", "start": 2207727, "end": 2211944}, {"filename": "/game/Data/Resources/move_gripped_cursor_down.png", "start": 2211944, "end": 2213591}, {"filename": "/game/Data/Resources/move_gripped_cursor_up.png", "start": 2213591, "end": 2215210}, {"filename": "/game/Data/Resources/move_npc_cursor_down.png", "start": 2215210, "end": 2216335}, {"filename": "/game/Data/Resources/move_npc_cursor_up.png", "start": 2216335, "end": 2217407}, {"filename": "/game/Data/Resources/move_npc_icon.png", "start": 2217407, "end": 2218549}, {"filename": "/game/Data/Resources/new_layer_button.png", "start": 2218549, "end": 2219287}, {"filename": "/game/Data/Resources/new_ship_button.png", "start": 2219287, "end": 2220402}, {"filename": "/game/Data/Resources/null_material.png", "start": 2220402, "end": 2221025}, {"filename": "/game/Data/Resources/open_image_button.png", "start": 2221025, "end": 2221644}, {"filename": "/game/Data/Resources/open_layer_button.png", "start": 2221644, "end": 2222144}, {"filename": "/game/Data/Resources/pan_cursor.png", "start": 2222144, "end": 2226361}, {"filename": "/game/Data/Resources/pan_icon.png", "start": 2226361, "end": 2226986}, {"filename": "/game/Data/Resources/paste_button.png", "start": 2226986, "end": 2229667}, {"filename": "/game/Data/Resources/paste_icon.png", "start": 2229667, "end": 2231374}, {"filename": "/game/Data/Resources/pencil_cursor.png", "start": 2231374, "end": 2231926}, {"filename": "/game/Data/Resources/pencil_icon.png", "start": 2231926, "end": 2232696}, {"filename": "/game/Data/Resources/physics_probe_cursor.png", "start": 2232696, "end": 2233488}, {"filename": "/game/Data/Resources/pin_cursor.png", "start": 2233488, "end": 2237705}, {"filename": "/game/Data/Resources/pixel_mode_icon_small.png", "start": 2237705, "end": 2238140}, {"filename": "/game/Data/Resources/place_npc_cursor_down.png", "start": 2238140, "end": 2239135}, {"filename": "/game/Data/Resources/place_npc_cursor_error.png", "start": 2239135, "end": 2241084}, {"filename": "/game/Data/Resources/place_npc_cursor_up.png", "start": 2241084, "end": 2242005}, {"filename": "/game/Data/Resources/play_icon_medium.png", "start": 2242005, "end": 2243295}, {"filename": "/game/Data/Resources/play_step_icon_medium.png", "start": 2243295, "end": 2244719}, {"filename": "/game/Data/Resources/pliers_cursor_down.png", "start": 2244719, "end": 2246086}, {"filename": "/game/Data/Resources/pliers_cursor_up.png", "start": 2246086, "end": 2247473}, {"filename": "/game/Data/Resources/position_icon.png", "start": 2247473, "end": 2247806}, {"filename": "/game/Data/Resources/power_monitor_off.png", "start": 2247806, "end": 2251899}, {"filename": "/game/Data/Resources/power_monitor_on.png", "start": 2251899, "end": 2256055}, {"filename": "/game/Data/Resources/preferences_button.png", "start": 2256055, "end": 2257705}, {"filename": "/game/Data/Resources/protected_medium.png", "start": 2257705, "end": 2259431}, {"filename": "/game/Data/Resources/protected_small.png", "start": 2259431, "end": 2260213}, {"filename": "/game/Data/Resources/question_mark_cursor_up.png", "start": 2260213, "end": 2261893}, {"filename": "/game/Data/Resources/question_medium.png", "start": 2261893, "end": 2267554}, {"filename": "/game/Data/Resources/quit_and_return_to_game_button.png", "start": 2267554, "end": 2269017}, {"filename": "/game/Data/Resources/quit_button.png", "start": 2269017, "end": 2269628}, {"filename": "/game/Data/Resources/rc_bomb_cursor.png", "start": 2269628, "end": 2273845}, {"filename": "/game/Data/Resources/rectangles_icon.png", "start": 2273845, "end": 2274421}, {"filename": "/game/Data/Resources/remove_npc_cursor_down.png", "start": 2274421, "end": 2275389}, {"filename": "/game/Data/Resources/remove_npc_cursor_up.png", "start": 2275389, "end": 2276303}, {"filename": "/game/Data/Resources/remove_npc_icon.png", "start": 2276303, "end": 2277503}, {"filename": "/game/Data/Resources/repair_structure_cursor_down_0.png", "start": 2277503, "end": 2281720}, {"filename": "/game/Data/Resources/repair_structure_cursor_down_1.png", "start": 2281720, "end": 2285937}, {"filename": "/game/Data/Resources/repair_structure_cursor_down_2.png", "start": 2285937, "end": 2290154}, {"filename": "/game/Data/Resources/repair_structure_cursor_down_3.png", "start": 2290154, "end": 2294371}, {"filename": "/game/Data/Resources/repair_structure_cursor_down_4.png", "start": 2294371, "end": 2298588}, {"filename": "/game/Data/Resources/repair_structure_cursor_up.png", "start": 2298588, "end": 2302805}, {"filename": "/game/Data/Resources/resize_button.png", "start": 2302805, "end": 2304302}, {"filename": "/game/Data/Resources/rewind_icon_medium.png", "start": 2304302, "end": 2306246}, {"filename": "/game/Data/Resources/right_arrow.png", "start": 2306246, "end": 2307375}, {"filename": "/game/Data/Resources/ropes_layer.png", "start": 2307375, "end": 2308799}, {"filename": "/game/Data/Resources/rot_cursor_down.png", "start": 2308799, "end": 2309689}, {"filename": "/game/Data/Resources/rot_cursor_up.png", "start": 2309689, "end": 2310703}, {"filename": "/game/Data/Resources/rotate_90_ccw_medium.png", "start": 2310703, "end": 2311565}, {"filename": "/game/Data/Resources/rotate_90_cw_medium.png", "start": 2311565, "end": 2312420}, {"filename": "/game/Data/Resources/rotate_90_cw_small.png", "start": 2312420, "end": 2313029}, {"filename": "/game/Data/Resources/sampler_cursor.png", "start": 2313029, "end": 2314243}, {"filename": "/game/Data/Resources/sampler_icon.png", "start": 2314243, "end": 2315280}, {"filename": "/game/Data/Resources/sampler_icon_small.png", "start": 2315280, "end": 2315954}, {"filename": "/game/Data/Resources/save_and_return_to_game_button.png", "start": 2315954, "end": 2317443}, {"filename": "/game/Data/Resources/save_layer_button.png", "start": 2317443, "end": 2318182}, {"filename": "/game/Data/Resources/save_ship_as_button.png", "start": 2318182, "end": 2319859}, {"filename": "/game/Data/Resources/save_ship_button.png", "start": 2319859, "end": 2321164}, {"filename": "/game/Data/Resources/scrub_cursor_down.png", "start": 2321164, "end": 2325381}, {"filename": "/game/Data/Resources/scrub_cursor_up.png", "start": 2325381, "end": 2329598}, {"filename": "/game/Data/Resources/selection_cursor.png", "start": 2329598, "end": 2331850}, {"filename": "/game/Data/Resources/selection_icon.png", "start": 2331850, "end": 2332271}, {"filename": "/game/Data/Resources/selection_size_icon.png", "start": 2332271, "end": 2332614}, {"filename": "/game/Data/Resources/ship_description_background.png", "start": 2332614, "end": 2417562}, {"filename": "/game/Data/Resources/ship_file_medium.png", "start": 2417562, "end": 2419656}, {"filename": "/game/Data/Resources/ship_preview_error.png", "start": 2419656, "end": 2428423}, {"filename": "/game/Data/Resources/ship_preview_ribbon_battery.png", "start": 2428423, "end": 2430831}, {"filename": "/game/Data/Resources/ship_preview_ribbon_battery_and_hd.png", "start": 2430831, "end": 2434553}, {"filename": "/game/Data/Resources/ship_preview_ribbon_hd.png", "start": 2434553, "end": 2437400}, {"filename": "/game/Data/Resources/ship_preview_wait.png", "start": 2437400, "end": 2446477}, {"filename": "/game/Data/Resources/ship_sound_switch_off_disabled.png", "start": 2446477, "end": 2457823}, {"filename": "/game/Data/Resources/ship_sound_switch_off_enabled.png", "start": 2457823, "end": 2469081}, {"filename": "/game/Data/Resources/ship_sound_switch_on_disabled.png", "start": 2469081, "end": 2480236}, {"filename": "/game/Data/Resources/ship_sound_switch_on_enabled.png", "start": 2480236, "end": 2491298}, {"filename": "/game/Data/Resources/shipbuilder_background.png", "start": 2491298, "end": 3625260}, {"filename": "/game/Data/Resources/smash_cursor_down.png", "start": 3625260, "end": 3629477}, {"filename": "/game/Data/Resources/smash_cursor_up.png", "start": 3629477, "end": 3633694}, {"filename": "/game/Data/Resources/sort_by_features_button.png", "start": 3633694, "end": 3635153}, {"filename": "/game/Data/Resources/sort_by_name_button.png", "start": 3635153, "end": 3635648}, {"filename": "/game/Data/Resources/sort_by_time_button.png", "start": 3635648, "end": 3636466}, {"filename": "/game/Data/Resources/sort_by_year_button.png", "start": 3636466, "end": 3637163}, {"filename": "/game/Data/Resources/splash_screen.png", "start": 3637163, "end": 3774025}, {"filename": "/game/Data/Resources/structural_layer.png", "start": 3774025, "end": 3775867}, {"filename": "/game/Data/Resources/structural_texture_mode_icon_small.png", "start": 3775867, "end": 3776449}, {"filename": "/game/Data/Resources/structure_tracer_button.png", "start": 3776449, "end": 3776909}, {"filename": "/game/Data/Resources/success_medium.png", "start": 3776909, "end": 3783159}, {"filename": "/game/Data/Resources/swirl_cursor_down_ccw.png", "start": 3783159, "end": 3787376}, {"filename": "/game/Data/Resources/swirl_cursor_down_cw.png", "start": 3787376, "end": 3791593}, {"filename": "/game/Data/Resources/swirl_cursor_up_ccw.png", "start": 3791593, "end": 3795810}, {"filename": "/game/Data/Resources/swirl_cursor_up_cw.png", "start": 3795810, "end": 3800027}, {"filename": "/game/Data/Resources/switch_cursor_up.png", "start": 3800027, "end": 3800805}, {"filename": "/game/Data/Resources/switchboard_background_01.png", "start": 3800805, "end": 4584826}, {"filename": "/game/Data/Resources/switchboard_background_02.png", "start": 4584826, "end": 4910417}, {"filename": "/game/Data/Resources/switchboard_background_03.png", "start": 4910417, "end": 5479986}, {"filename": "/game/Data/Resources/switchboard_background_04.png", "start": 5479986, "end": 5561319}, {"filename": "/game/Data/Resources/switchboard_background_05.png", "start": 5561319, "end": 5925936}, {"filename": "/game/Data/Resources/switchboard_background_06.png", "start": 5925936, "end": 6162001}, {"filename": "/game/Data/Resources/switchboard_background_07.png", "start": 6162001, "end": 6199373}, {"filename": "/game/Data/Resources/switchboard_background_08.png", "start": 6199373, "end": 6351732}, {"filename": "/game/Data/Resources/switchboard_background_09.png", "start": 6351732, "end": 7125647}, {"filename": "/game/Data/Resources/switchboard_background_10.png", "start": 7125647, "end": 7973310}, {"filename": "/game/Data/Resources/switchboard_background_11.png", "start": 7973310, "end": 8579964}, {"filename": "/game/Data/Resources/switchboard_background_12.png", "start": 8579964, "end": 9028468}, {"filename": "/game/Data/Resources/telegraph_background_disabled.png", "start": 9028468, "end": 9041557}, {"filename": "/game/Data/Resources/telegraph_background_enabled.png", "start": 9041557, "end": 9055770}, {"filename": "/game/Data/Resources/telegraph_hand_0.png", "start": 9055770, "end": 9058687}, {"filename": "/game/Data/Resources/telegraph_hand_1.png", "start": 9058687, "end": 9061339}, {"filename": "/game/Data/Resources/telegraph_hand_10.png", "start": 9061339, "end": 9064302}, {"filename": "/game/Data/Resources/telegraph_hand_2.png", "start": 9064302, "end": 9067216}, {"filename": "/game/Data/Resources/telegraph_hand_3.png", "start": 9067216, "end": 9070363}, {"filename": "/game/Data/Resources/telegraph_hand_4.png", "start": 9070363, "end": 9073579}, {"filename": "/game/Data/Resources/telegraph_hand_5.png", "start": 9073579, "end": 9076486}, {"filename": "/game/Data/Resources/telegraph_hand_6.png", "start": 9076486, "end": 9079648}, {"filename": "/game/Data/Resources/telegraph_hand_7.png", "start": 9079648, "end": 9082768}, {"filename": "/game/Data/Resources/telegraph_hand_8.png", "start": 9082768, "end": 9085548}, {"filename": "/game/Data/Resources/telegraph_hand_9.png", "start": 9085548, "end": 9088297}, {"filename": "/game/Data/Resources/terrain_adjust_cursor_down.png", "start": 9088297, "end": 9092514}, {"filename": "/game/Data/Resources/terrain_adjust_cursor_error.png", "start": 9092514, "end": 9096731}, {"filename": "/game/Data/Resources/terrain_adjust_cursor_up.png", "start": 9096731, "end": 9100948}, {"filename": "/game/Data/Resources/texture_mode_icon_small.png", "start": 9100948, "end": 9101542}, {"filename": "/game/Data/Resources/thanos_snap_cursor_down.png", "start": 9101542, "end": 9105759}, {"filename": "/game/Data/Resources/thanos_snap_cursor_down_structural.png", "start": 9105759, "end": 9107693}, {"filename": "/game/Data/Resources/thanos_snap_cursor_up.png", "start": 9107693, "end": 9111910}, {"filename": "/game/Data/Resources/thanos_snap_cursor_up_structural.png", "start": 9111910, "end": 9113340}, {"filename": "/game/Data/Resources/thrust_button_off_disabled.png", "start": 9113340, "end": 9117603}, {"filename": "/game/Data/Resources/thrust_button_off_enabled.png", "start": 9117603, "end": 9121364}, {"filename": "/game/Data/Resources/thrust_button_on_disabled.png", "start": 9121364, "end": 9125581}, {"filename": "/game/Data/Resources/thrust_button_on_enabled.png", "start": 9125581, "end": 9129256}, {"filename": "/game/Data/Resources/timer_bomb_cursor.png", "start": 9129256, "end": 9133473}, {"filename": "/game/Data/Resources/tornado_cursor_down.png", "start": 9133473, "end": 9134876}, {"filename": "/game/Data/Resources/tornado_cursor_up.png", "start": 9134876, "end": 9136262}, {"filename": "/game/Data/Resources/trim_medium.png", "start": 9136262, "end": 9136986}, {"filename": "/game/Data/Resources/turnaround_cursor_down.png", "start": 9136986, "end": 9137599}, {"filename": "/game/Data/Resources/turnaround_cursor_up.png", "start": 9137599, "end": 9138206}, {"filename": "/game/Data/Resources/turnaround_npc_icon.png", "start": 9138206, "end": 9139162}, {"filename": "/game/Data/Resources/under_construction_large.png", "start": 9139162, "end": 9173890}, {"filename": "/game/Data/Resources/under_construction_medium.png", "start": 9173890, "end": 9178123}, {"filename": "/game/Data/Resources/under_construction_small.png", "start": 9178123, "end": 9179975}, {"filename": "/game/Data/Resources/undo_medium.png", "start": 9179975, "end": 9180785}, {"filename": "/game/Data/Resources/unprotected_medium.png", "start": 9180785, "end": 9182539}, {"filename": "/game/Data/Resources/unprotected_with_check_medium.png", "start": 9182539, "end": 9186234}, {"filename": "/game/Data/Resources/uv_mode_icon.png", "start": 9186234, "end": 9191733}, {"filename": "/game/Data/Resources/validate_ship_button.png", "start": 9191733, "end": 9193485}, {"filename": "/game/Data/Resources/view_grid_button.png", "start": 9193485, "end": 9193798}, {"filename": "/game/Data/Resources/view_waterline_markers_button.png", "start": 9193798, "end": 9194274}, {"filename": "/game/Data/Resources/visible_icon_medium.png", "start": 9194274, "end": 9195160}, {"filename": "/game/Data/Resources/warning_icon.png", "start": 9195160, "end": 9196291}, {"filename": "/game/Data/Resources/warning_medium.png", "start": 9196291, "end": 9201530}, {"filename": "/game/Data/Resources/waterline_analysis_icon_medium.png", "start": 9201530, "end": 9202382}, {"filename": "/game/Data/Resources/waterline_ship.png", "start": 9202382, "end": 9202761}, {"filename": "/game/Data/Resources/watertight_door_closed_disabled.png", "start": 9202761, "end": 9209618}, {"filename": "/game/Data/Resources/watertight_door_closed_enabled.png", "start": 9209618, "end": 9214702}, {"filename": "/game/Data/Resources/watertight_door_open_disabled.png", "start": 9214702, "end": 9221553}, {"filename": "/game/Data/Resources/watertight_door_open_enabled.png", "start": 9221553, "end": 9226521}, {"filename": "/game/Data/Resources/wave_maker_cursor_down.png", "start": 9226521, "end": 9230738}, {"filename": "/game/Data/Resources/wave_maker_cursor_up.png", "start": 9230738, "end": 9234955}, {"filename": "/game/Data/Resources/weight_icon_small.png", "start": 9234955, "end": 9235576}, {"filename": "/game/Data/Resources/width_icon_small.png", "start": 9235576, "end": 9235904}, {"filename": "/game/Data/Resources/wind_cursor_down_1.png", "start": 9235904, "end": 9237375}, {"filename": "/game/Data/Resources/wind_cursor_down_2.png", "start": 9237375, "end": 9238853}, {"filename": "/game/Data/Resources/wind_cursor_down_3.png", "start": 9238853, "end": 9240324}, {"filename": "/game/Data/Resources/wind_cursor_up.png", "start": 9240324, "end": 9241795}, {"filename": "/game/Data/Resources/x_40x40.png", "start": 9241795, "end": 9244858}, {"filename": "/game/Data/Resources/x_medium.png", "start": 9244858, "end": 9247063}, {"filename": "/game/Data/Resources/x_small.png", "start": 9247063, "end": 9249369}, {"filename": "/game/Data/Resources/zoom_icon_small.png", "start": 9249369, "end": 9250052}, {"filename": "/game/Data/Resources/zoom_in_medium.png", "start": 9250052, "end": 9251673}, {"filename": "/game/Data/Resources/zoom_out_medium.png", "start": 9251673, "end": 9253302}, {"filename": "/game/Data/Resources/zoom_reset_medium.png", "start": 9253302, "end": 9255098}, {"filename": "/game/Data/Shaders/GPUCalc/add.glsl", "start": 9255098, "end": 9255744}, {"filename": "/game/Data/Shaders/GPUCalc/pixel_coords.glsl", "start": 9255744, "end": 9256088}, {"filename": "/game/Data/Shaders/Game/aabbs.glsl", "start": 9256088, "end": 9256551}, {"filename": "/game/Data/Shaders/Game/am_bomb_preimplosion.glsl", "start": 9256551, "end": 9257916}, {"filename": "/game/Data/Shaders/Game/anti_gravity_field.glsl", "start": 9257916, "end": 9260481}, {"filename": "/game/Data/Shaders/Game/clouds.glslinc", "start": 9260481, "end": 9263392}, {"filename": "/game/Data/Shaders/Game/clouds_basic.glsl", "start": 9263392, "end": 9263418}, {"filename": "/game/Data/Shaders/Game/clouds_detailed.glsl", "start": 9263418, "end": 9263468}, {"filename": "/game/Data/Shaders/Game/common.glslinc", "start": 9263468, "end": 9264907}, {"filename": "/game/Data/Shaders/Game/cross_of_light.glsl", "start": 9264907, "end": 9266485}, {"filename": "/game/Data/Shaders/Game/fishes.glslinc", "start": 9266485, "end": 9272756}, {"filename": "/game/Data/Shaders/Game/fishes_basic.glsl", "start": 9272756, "end": 9272781}, {"filename": "/game/Data/Shaders/Game/fishes_detailed.glsl", "start": 9272781, "end": 9272830}, {"filename": "/game/Data/Shaders/Game/generic_mipmapped_textures_ndc.glsl", "start": 9272830, "end": 9274592}, {"filename": "/game/Data/Shaders/Game/interactive_tool_dashed_lines.glsl", "start": 9274592, "end": 9275300}, {"filename": "/game/Data/Shaders/Game/lamp_tool.glslinc", "start": 9275300, "end": 9276321}, {"filename": "/game/Data/Shaders/Game/land.glslinc", "start": 9276321, "end": 9276639}, {"filename": "/game/Data/Shaders/Game/land_flat.glslinc", "start": 9276639, "end": 9278770}, {"filename": "/game/Data/Shaders/Game/land_flat_basic.glsl", "start": 9278770, "end": 9278798}, {"filename": "/game/Data/Shaders/Game/land_flat_detailed.glsl", "start": 9278798, "end": 9278848}, {"filename": "/game/Data/Shaders/Game/land_texture.glslinc", "start": 9278848, "end": 9281474}, {"filename": "/game/Data/Shaders/Game/land_texture_basic.glsl", "start": 9281474, "end": 9281505}, {"filename": "/game/Data/Shaders/Game/land_texture_detailed.glsl", "start": 9281505, "end": 9281558}, {"filename": "/game/Data/Shaders/Game/laser_ray.glsl", "start": 9281558, "end": 9284240}, {"filename": "/game/Data/Shaders/Game/lightning.glsl", "start": 9284240, "end": 9287051}, {"filename": "/game/Data/Shaders/Game/multi_notification_ndccoords.glsl", "start": 9287051, "end": 9289410}, {"filename": "/game/Data/Shaders/Game/multi_notification_worldcoords.glsl", "start": 9289410, "end": 9300101}, {"filename": "/game/Data/Shaders/Game/ocean.glslinc", "start": 9300101, "end": 9304144}, {"filename": "/game/Data/Shaders/Game/ocean_depth_basic.glsl", "start": 9304144, "end": 9305825}, {"filename": "/game/Data/Shaders/Game/ocean_depth_detailed.glslinc", "start": 9305825, "end": 9309238}, {"filename": "/game/Data/Shaders/Game/ocean_depth_detailed_background_lower.glsl", "start": 9309238, "end": 9309304}, {"filename": "/game/Data/Shaders/Game/ocean_depth_detailed_background_upper.glsl", "start": 9309304, "end": 9309387}, {"filename": "/game/Data/Shaders/Game/ocean_depth_detailed_foreground_lower.glsl", "start": 9309387, "end": 9309427}, {"filename": "/game/Data/Shaders/Game/ocean_depth_detailed_foreground_upper.glsl", "start": 9309427, "end": 9309484}, {"filename": "/game/Data/Shaders/Game/ocean_flat_basic.glsl", "start": 9309484, "end": 9310456}, {"filename": "/game/Data/Shaders/Game/ocean_flat_detailed.glslinc", "start": 9310456, "end": 9313748}, {"filename": "/game/Data/Shaders/Game/ocean_flat_detailed_background_lower.glsl", "start": 9313748, "end": 9313813}, {"filename": "/game/Data/Shaders/Game/ocean_flat_detailed_background_upper.glsl", "start": 9313813, "end": 9313895}, {"filename": "/game/Data/Shaders/Game/ocean_flat_detailed_foreground_lower.glsl", "start": 9313895, "end": 9313934}, {"filename": "/game/Data/Shaders/Game/ocean_flat_detailed_foreground_upper.glsl", "start": 9313934, "end": 9313990}, {"filename": "/game/Data/Shaders/Game/ocean_texture_basic.glsl", "start": 9313990, "end": 9316001}, {"filename": "/game/Data/Shaders/Game/ocean_texture_detailed.glslinc", "start": 9316001, "end": 9319750}, {"filename": "/game/Data/Shaders/Game/ocean_texture_detailed_background_lower.glsl", "start": 9319750, "end": 9319818}, {"filename": "/game/Data/Shaders/Game/ocean_texture_detailed_background_upper.glsl", "start": 9319818, "end": 9319903}, {"filename": "/game/Data/Shaders/Game/ocean_texture_detailed_foreground_lower.glsl", "start": 9319903, "end": 9319945}, {"filename": "/game/Data/Shaders/Game/ocean_texture_detailed_foreground_upper.glsl", "start": 9319945, "end": 9320004}, {"filename": "/game/Data/Shaders/Game/physics_probe_panel.glsl", "start": 9320004, "end": 9323856}, {"filename": "/game/Data/Shaders/Game/rain.glsl", "start": 9323856, "end": 9325928}, {"filename": "/game/Data/Shaders/Game/rect_selection.glsl", "start": 9325928, "end": 9329182}, {"filename": "/game/Data/Shaders/Game/ship_air_pressure.glslinc", "start": 9329182, "end": 9330811}, {"filename": "/game/Data/Shaders/Game/ship_centers.glsl", "start": 9330811, "end": 9332066}, {"filename": "/game/Data/Shaders/Game/ship_circle_highlights.glsl", "start": 9332066, "end": 9332910}, {"filename": "/game/Data/Shaders/Game/ship_electric_sparks.glsl", "start": 9332910, "end": 9333712}, {"filename": "/game/Data/Shaders/Game/ship_electrical_element_highlights.glsl", "start": 9333712, "end": 9335076}, {"filename": "/game/Data/Shaders/Game/ship_element.glslinc", "start": 9335076, "end": 9345464}, {"filename": "/game/Data/Shaders/Game/ship_explosions.glsl", "start": 9345464, "end": 9351720}, {"filename": "/game/Data/Shaders/Game/ship_flames.glslinc", "start": 9351720, "end": 9357869}, {"filename": "/game/Data/Shaders/Game/ship_flames_background.glsl", "start": 9357869, "end": 9357899}, {"filename": "/game/Data/Shaders/Game/ship_flames_foreground.glsl", "start": 9357899, "end": 9357929}, {"filename": "/game/Data/Shaders/Game/ship_frontier_edges.glsl", "start": 9357929, "end": 9358835}, {"filename": "/game/Data/Shaders/Game/ship_generic_mipmapped_textures.glsl", "start": 9358835, "end": 9361974}, {"filename": "/game/Data/Shaders/Game/ship_heat.glslinc", "start": 9361974, "end": 9362849}, {"filename": "/game/Data/Shaders/Game/ship_jet_engine_flames.glsl", "start": 9362849, "end": 9365470}, {"filename": "/game/Data/Shaders/Game/ship_npcs_quad.glslinc", "start": 9365470, "end": 9370336}, {"filename": "/game/Data/Shaders/Game/ship_npcs_quad_flat.glsl", "start": 9370336, "end": 9370369}, {"filename": "/game/Data/Shaders/Game/ship_npcs_quad_with_roles.glsl", "start": 9370369, "end": 9370421}, {"filename": "/game/Data/Shaders/Game/ship_npcs_texture.glsl", "start": 9370421, "end": 9374290}, {"filename": "/game/Data/Shaders/Game/ship_point_to_point_arrows.glsl", "start": 9374290, "end": 9374821}, {"filename": "/game/Data/Shaders/Game/ship_points_color.glsl", "start": 9374821, "end": 9374952}, {"filename": "/game/Data/Shaders/Game/ship_points_color_heatoverlay.glsl", "start": 9374952, "end": 9375083}, {"filename": "/game/Data/Shaders/Game/ship_points_color_heatoverlay_stress.glsl", "start": 9375083, "end": 9375214}, {"filename": "/game/Data/Shaders/Game/ship_points_color_incandescence.glsl", "start": 9375214, "end": 9375345}, {"filename": "/game/Data/Shaders/Game/ship_points_color_incandescence_stress.glsl", "start": 9375345, "end": 9375476}, {"filename": "/game/Data/Shaders/Game/ship_points_color_stress.glsl", "start": 9375476, "end": 9375607}, {"filename": "/game/Data/Shaders/Game/ship_ropes.glsl", "start": 9375607, "end": 9375737}, {"filename": "/game/Data/Shaders/Game/ship_ropes_heatoverlay.glsl", "start": 9375737, "end": 9375867}, {"filename": "/game/Data/Shaders/Game/ship_ropes_heatoverlay_stress.glsl", "start": 9375867, "end": 9375997}, {"filename": "/game/Data/Shaders/Game/ship_ropes_incandescence.glsl", "start": 9375997, "end": 9376127}, {"filename": "/game/Data/Shaders/Game/ship_ropes_incandescence_stress.glsl", "start": 9376127, "end": 9376257}, {"filename": "/game/Data/Shaders/Game/ship_ropes_stress.glsl", "start": 9376257, "end": 9376387}, {"filename": "/game/Data/Shaders/Game/ship_sparkles.glsl", "start": 9376387, "end": 9377984}, {"filename": "/game/Data/Shaders/Game/ship_springs_air_pressure.glsl", "start": 9377984, "end": 9378020}, {"filename": "/game/Data/Shaders/Game/ship_springs_color.glsl", "start": 9378020, "end": 9378150}, {"filename": "/game/Data/Shaders/Game/ship_springs_color_heatoverlay.glsl", "start": 9378150, "end": 9378280}, {"filename": "/game/Data/Shaders/Game/ship_springs_color_heatoverlay_stress.glsl", "start": 9378280, "end": 9378410}, {"filename": "/game/Data/Shaders/Game/ship_springs_color_incandescence.glsl", "start": 9378410, "end": 9378540}, {"filename": "/game/Data/Shaders/Game/ship_springs_color_incandescence_stress.glsl", "start": 9378540, "end": 9378670}, {"filename": "/game/Data/Shaders/Game/ship_springs_color_stress.glsl", "start": 9378670, "end": 9378800}, {"filename": "/game/Data/Shaders/Game/ship_springs_strength.glsl", "start": 9378800, "end": 9378832}, {"filename": "/game/Data/Shaders/Game/ship_springs_texture.glsl", "start": 9378832, "end": 9378937}, {"filename": "/game/Data/Shaders/Game/ship_springs_texture_heatoverlay.glsl", "start": 9378937, "end": 9379042}, {"filename": "/game/Data/Shaders/Game/ship_springs_texture_heatoverlay_stress.glsl", "start": 9379042, "end": 9379147}, {"filename": "/game/Data/Shaders/Game/ship_springs_texture_incandescence.glsl", "start": 9379147, "end": 9379252}, {"filename": "/game/Data/Shaders/Game/ship_springs_texture_incandescence_stress.glsl", "start": 9379252, "end": 9379357}, {"filename": "/game/Data/Shaders/Game/ship_springs_texture_stress.glsl", "start": 9379357, "end": 9379462}, {"filename": "/game/Data/Shaders/Game/ship_strength.glslinc", "start": 9379462, "end": 9380972}, {"filename": "/game/Data/Shaders/Game/ship_stressed_springs.glsl", "start": 9380972, "end": 9381584}, {"filename": "/game/Data/Shaders/Game/ship_triangles_air_pressure.glsl", "start": 9381584, "end": 9381620}, {"filename": "/game/Data/Shaders/Game/ship_triangles_color.glsl", "start": 9381620, "end": 9381732}, {"filename": "/game/Data/Shaders/Game/ship_triangles_color_heatoverlay.glsl", "start": 9381732, "end": 9381844}, {"filename": "/game/Data/Shaders/Game/ship_triangles_color_heatoverlay_stress.glsl", "start": 9381844, "end": 9381956}, {"filename": "/game/Data/Shaders/Game/ship_triangles_color_incandescence.glsl", "start": 9381956, "end": 9382068}, {"filename": "/game/Data/Shaders/Game/ship_triangles_color_incandescence_stress.glsl", "start": 9382068, "end": 9382180}, {"filename": "/game/Data/Shaders/Game/ship_triangles_color_stress.glsl", "start": 9382180, "end": 9382292}, {"filename": "/game/Data/Shaders/Game/ship_triangles_strength.glsl", "start": 9382292, "end": 9382324}, {"filename": "/game/Data/Shaders/Game/ship_triangles_texture.glsl", "start": 9382324, "end": 9382411}, {"filename": "/game/Data/Shaders/Game/ship_triangles_texture_heatoverlay.glsl", "start": 9382411, "end": 9382498}, {"filename": "/game/Data/Shaders/Game/ship_triangles_texture_heatoverlay_stress.glsl", "start": 9382498, "end": 9382585}, {"filename": "/game/Data/Shaders/Game/ship_triangles_texture_incandescence.glsl", "start": 9382585, "end": 9382672}, {"filename": "/game/Data/Shaders/Game/ship_triangles_texture_incandescence_stress.glsl", "start": 9382672, "end": 9382759}, {"filename": "/game/Data/Shaders/Game/ship_triangles_texture_stress.glsl", "start": 9382759, "end": 9382846}, {"filename": "/game/Data/Shaders/Game/ship_vectors.glsl", "start": 9382846, "end": 9383301}, {"filename": "/game/Data/Shaders/Game/sky.glsl", "start": 9383301, "end": 9384984}, {"filename": "/game/Data/Shaders/Game/stars.glsl", "start": 9384984, "end": 9385628}, {"filename": "/game/Data/Shaders/Game/static_parameters.glslinc", "start": 9385628, "end": 9386114}, {"filename": "/game/Data/Shaders/Game/text.glsl", "start": 9386114, "end": 9387043}, {"filename": "/game/Data/Shaders/Game/texture_notifications.glsl", "start": 9387043, "end": 9388099}, {"filename": "/game/Data/Shaders/Game/tornado.glsl", "start": 9388099, "end": 9394695}, {"filename": "/game/Data/Shaders/Game/underwater_plant.glsl", "start": 9394695, "end": 9399230}, {"filename": "/game/Data/Shaders/Game/world_border.glsl", "start": 9399230, "end": 9400104}, {"filename": "/game/Data/Shaders/ShipBuilder/canvas.glsl", "start": 9400104, "end": 9401307}, {"filename": "/game/Data/Shaders/ShipBuilder/circle_overlay.glsl", "start": 9401307, "end": 9402505}, {"filename": "/game/Data/Shaders/ShipBuilder/dashed_line_overlay.glsl", "start": 9402505, "end": 9403393}, {"filename": "/game/Data/Shaders/ShipBuilder/grid.glsl", "start": 9403393, "end": 9405354}, {"filename": "/game/Data/Shaders/ShipBuilder/matte.glsl", "start": 9405354, "end": 9405899}, {"filename": "/game/Data/Shaders/ShipBuilder/mipmapped_texture_quad.glsl", "start": 9405899, "end": 9406556}, {"filename": "/game/Data/Shaders/ShipBuilder/rect_overlay.glsl", "start": 9406556, "end": 9407797}, {"filename": "/game/Data/Shaders/ShipBuilder/structure_mesh.glsl", "start": 9407797, "end": 9413167}, {"filename": "/game/Data/Shaders/ShipBuilder/texture.glsl", "start": 9413167, "end": 9413890}, {"filename": "/game/Data/Shaders/ShipBuilder/texture_ndc.glsl", "start": 9413890, "end": 9414472}, {"filename": "/game/Data/Shaders/ShipBuilder/waterline.glsl", "start": 9414472, "end": 9415470}, {"filename": "/game/Data/Textures/Atlases/Cloud.atlas.json", "start": 9415470, "end": 9429089}, {"filename": "/game/Data/Textures/Atlases/Cloud.atlas.png", "start": 9429089, "end": 10505163}, {"filename": "/game/Data/Textures/Atlases/Explosion.atlas.json", "start": 10505163, "end": 10567945}, {"filename": "/game/Data/Textures/Atlases/Explosion.atlas.png", "start": 10567945, "end": 17156633}, {"filename": "/game/Data/Textures/Atlases/NPC.atlas.json", "start": 17156633, "end": 17574563}, {"filename": "/game/Data/Textures/Atlases/NPC.atlas.png", "start": 17574563, "end": 17694554}, {"filename": "/game/Data/Textures/Fish/barracuda_2.png", "start": 17694554, "end": 17708106}, {"filename": "/game/Data/Textures/Fish/barracuda_6.png", "start": 17708106, "end": 17731189}, {"filename": "/game/Data/Textures/Fish/butterflyfish_13.png", "start": 17731189, "end": 17803365}, {"filename": "/game/Data/Textures/Fish/database.json", "start": 17803365, "end": 17803888}, {"filename": "/game/Data/Textures/Fish/deepsea_angler_10.png", "start": 17803888, "end": 17841754}, {"filename": "/game/Data/Textures/Fish/gilthead_bream_0.png", "start": 17841754, "end": 17889564}, {"filename": "/game/Data/Textures/Fish/gilthead_bream_1.png", "start": 17889564, "end": 17929853}, {"filename": "/game/Data/Textures/Fish/mako_3.png", "start": 17929853, "end": 18006567}, {"filename": "/game/Data/Textures/Fish/queen_snapper_4.png", "start": 18006567, "end": 18035359}, {"filename": "/game/Data/Textures/Fish/queen_snapper_5.png", "start": 18035359, "end": 18066855}, {"filename": "/game/Data/Textures/Fish/tuna_7.png", "start": 18066855, "end": 18104920}, {"filename": "/game/Data/Textures/Fish/tuna_8.png", "start": 18104920, "end": 18145313}, {"filename": "/game/Data/Textures/Fish/tuna_9.png", "start": 18145313, "end": 18176766}, {"filename": "/game/Data/Textures/Fish/yellowtail_snapper_11.png", "start": 18176766, "end": 18298473}, {"filename": "/game/Data/Textures/Fish/yellowtail_snapper_12.png", "start": 18298473, "end": 18442063}, {"filename": "/game/Data/Textures/GenericLinearTexture/autofocus_notification_0.png", "start": 18442063, "end": 18447535}, {"filename": "/game/Data/Textures/GenericLinearTexture/database.json", "start": 18447535, "end": 18449536}, {"filename": "/game/Data/Textures/GenericLinearTexture/daylight_cycle_notification_0.png", "start": 18449536, "end": 18463248}, {"filename": "/game/Data/Textures/GenericLinearTexture/fire_0.png", "start": 18463248, "end": 18607309}, {"filename": "/game/Data/Textures/GenericLinearTexture/physics_probe_panel_0.png", "start": 18607309, "end": 18798629}, {"filename": "/game/Data/Textures/GenericLinearTexture/physics_probe_panel_1.png", "start": 18798629, "end": 18990034}, {"filename": "/game/Data/Textures/GenericLinearTexture/physics_probe_panel_2.png", "start": 18990034, "end": 19181455}, {"filename": "/game/Data/Textures/GenericLinearTexture/shift_notification_0.png", "start": 19181455, "end": 19185795}, {"filename": "/game/Data/Textures/GenericLinearTexture/sound_mute_notification_0.png", "start": 19185795, "end": 19192315}, {"filename": "/game/Data/Textures/GenericLinearTexture/underwater_plant_0.png", "start": 19192315, "end": 19270586}, {"filename": "/game/Data/Textures/GenericLinearTexture/underwater_plant_1.png", "start": 19270586, "end": 19333864}, {"filename": "/game/Data/Textures/GenericLinearTexture/underwater_plant_2.png", "start": 19333864, "end": 19371630}, {"filename": "/game/Data/Textures/GenericLinearTexture/underwater_plant_3.png", "start": 19371630, "end": 19404338}, {"filename": "/game/Data/Textures/GenericLinearTexture/underwater_plant_4.png", "start": 19404338, "end": 19433251}, {"filename": "/game/Data/Textures/GenericLinearTexture/underwater_plant_5.png", "start": 19433251, "end": 19446323}, {"filename": "/game/Data/Textures/GenericLinearTexture/underwater_plant_6.png", "start": 19446323, "end": 19557532}, {"filename": "/game/Data/Textures/GenericLinearTexture/uv_mode_notification_0.png", "start": 19557532, "end": 19565223}, {"filename": "/game/Data/Textures/GenericMipMappedTexture/air_bubble_0.png", "start": 19565223, "end": 19916372}, {"filename": "/game/Data/Textures/GenericMipMappedTexture/am_bomb_armor_0.png", "start": 19916372, "end": 20060153}, {"filename": "/game/Data/Textures/GenericMipMappedTexture/am_bomb_sphere_0.png", "start": 20060153, "end": 20115735}, {"filename": "/game/Data/Textures/GenericMipMappedTexture/am_bomb_sphere_cloud_0.png", "start": 20115735, "end": 20130594}, {"filename": "/game/Data/Textures/GenericMipMappedTexture/database.json", "start": 20130594, "end": 20134691}, {"filename": "/game/Data/Textures/GenericMipMappedTexture/engine_wake_0.png", "start": 20134691, "end": 20147732}, {"filename": "/game/Data/Textures/GenericMipMappedTexture/fire_extinguishing_bomb_0.png", "start": 20147732, "end": 20183601}, {"filename": "/game/Data/Textures/GenericMipMappedTexture/impact_bomb_0.png", "start": 20183601, "end": 20207273}, {"filename": "/game/Data/Textures/GenericMipMappedTexture/laser_cannon_0.png", "start": 20207273, "end": 20229979}, {"filename": "/game/Data/Textures/GenericMipMappedTexture/physics_probe_0.png", "start": 20229979, "end": 20263780}, {"filename": "/game/Data/Textures/GenericMipMappedTexture/physics_probe_ping_0.png", "start": 20263780, "end": 20269764}, {"filename": "/game/Data/Textures/GenericMipMappedTexture/pinned_point_0.png", "start": 20269764, "end": 20274020}, {"filename": "/game/Data/Textures/GenericMipMappedTexture/rc_bomb_0.png", "start": 20274020, "end": 20330562}, {"filename": "/game/Data/Textures/GenericMipMappedTexture/rc_bomb_ping_0.png", "start": 20330562, "end": 20341769}, {"filename": "/game/Data/Textures/GenericMipMappedTexture/rc_bomb_ping_1.png", "start": 20341769, "end": 20352977}, {"filename": "/game/Data/Textures/GenericMipMappedTexture/rc_bomb_ping_2.png", "start": 20352977, "end": 20364182}, {"filename": "/game/Data/Textures/GenericMipMappedTexture/rc_bomb_ping_3.png", "start": 20364182, "end": 20375381}, {"filename": "/game/Data/Textures/GenericMipMappedTexture/silt_cloud_0.png", "start": 20375381, "end": 20434395}, {"filename": "/game/Data/Textures/GenericMipMappedTexture/silt_cloud_1.png", "start": 20434395, "end": 20499528}, {"filename": "/game/Data/Textures/GenericMipMappedTexture/smoke_dark_0.png", "start": 20499528, "end": 20563450}, {"filename": "/game/Data/Textures/GenericMipMappedTexture/smoke_dark_1.png", "start": 20563450, "end": 20622628}, {"filename": "/game/Data/Textures/GenericMipMappedTexture/smoke_dark_2.png", "start": 20622628, "end": 20676747}, {"filename": "/game/Data/Textures/GenericMipMappedTexture/smoke_dark_3.png", "start": 20676747, "end": 20741264}, {"filename": "/game/Data/Textures/GenericMipMappedTexture/smoke_dark_4.png", "start": 20741264, "end": 20796413}, {"filename": "/game/Data/Textures/GenericMipMappedTexture/smoke_dark_5.png", "start": 20796413, "end": 20850862}, {"filename": "/game/Data/Textures/GenericMipMappedTexture/smoke_dark_6.png", "start": 20850862, "end": 20912914}, {"filename": "/game/Data/Textures/GenericMipMappedTexture/smoke_light_0.png", "start": 20912914, "end": 20957729}, {"filename": "/game/Data/Textures/GenericMipMappedTexture/smoke_light_1.png", "start": 20957729, "end": 20990032}, {"filename": "/game/Data/Textures/GenericMipMappedTexture/smoke_light_2.png", "start": 20990032, "end": 21037647}, {"filename": "/game/Data/Textures/GenericMipMappedTexture/smoke_light_3.png", "start": 21037647, "end": 21081875}, {"filename": "/game/Data/Textures/GenericMipMappedTexture/smoke_light_4.png", "start": 21081875, "end": 21128193}, {"filename": "/game/Data/Textures/GenericMipMappedTexture/smoke_light_5.png", "start": 21128193, "end": 21171134}, {"filename": "/game/Data/Textures/GenericMipMappedTexture/timer_bomb_0.png", "start": 21171134, "end": 21181381}, {"filename": "/game/Data/Textures/GenericMipMappedTexture/timer_bomb_1.png", "start": 21181381, "end": 21191755}, {"filename": "/game/Data/Textures/GenericMipMappedTexture/timer_bomb_2.png", "start": 21191755, "end": 21202047}, {"filename": "/game/Data/Textures/GenericMipMappedTexture/timer_bomb_3.png", "start": 21202047, "end": 21212231}, {"filename": "/game/Data/Textures/GenericMipMappedTexture/timer_bomb_4.png", "start": 21212231, "end": 21222012}, {"filename": "/game/Data/Textures/GenericMipMappedTexture/timer_bomb_fuse_0.png", "start": 21222012, "end": 21239293}, {"filename": "/game/Data/Textures/GenericMipMappedTexture/timer_bomb_fuse_1.png", "start": 21239293, "end": 21258089}, {"filename": "/game/Data/Textures/GenericMipMappedTexture/timer_bomb_fuse_10.png", "start": 21258089, "end": 21275876}, {"filename": "/game/Data/Textures/GenericMipMappedTexture/timer_bomb_fuse_11.png", "start": 21275876, "end": 21292491}, {"filename": "/game/Data/Textures/GenericMipMappedTexture/timer_bomb_fuse_12.png", "start": 21292491, "end": 21307310}, {"filename": "/game/Data/Textures/GenericMipMappedTexture/timer_bomb_fuse_13.png", "start": 21307310, "end": 21321801}, {"filename": "/game/Data/Textures/GenericMipMappedTexture/timer_bomb_fuse_14.png", "start": 21321801, "end": 21338971}, {"filename": "/game/Data/Textures/GenericMipMappedTexture/timer_bomb_fuse_15.png", "start": 21338971, "end": 21349074}, {"filename": "/game/Data/Textures/GenericMipMappedTexture/timer_bomb_fuse_16.png", "start": 21349074, "end": 21364417}, {"filename": "/game/Data/Textures/GenericMipMappedTexture/timer_bomb_fuse_2.png", "start": 21364417, "end": 21382994}, {"filename": "/game/Data/Textures/GenericMipMappedTexture/timer_bomb_fuse_3.png", "start": 21382994, "end": 21397505}, {"filename": "/game/Data/Textures/GenericMipMappedTexture/timer_bomb_fuse_4.png", "start": 21397505, "end": 21415367}, {"filename": "/game/Data/Textures/GenericMipMappedTexture/timer_bomb_fuse_5.png", "start": 21415367, "end": 21431757}, {"filename": "/game/Data/Textures/GenericMipMappedTexture/timer_bomb_fuse_6.png", "start": 21431757, "end": 21447770}, {"filename": "/game/Data/Textures/GenericMipMappedTexture/timer_bomb_fuse_7.png", "start": 21447770, "end": 21469570}, {"filename": "/game/Data/Textures/GenericMipMappedTexture/timer_bomb_fuse_8.png", "start": 21469570, "end": 21487501}, {"filename": "/game/Data/Textures/GenericMipMappedTexture/timer_bomb_fuse_9.png", "start": 21487501, "end": 21505648}, {"filename": "/game/Data/Textures/GenericMipMappedTexture/water_foam_0.png", "start": 21505648, "end": 21636589}, {"filename": "/game/Data/Textures/GenericMipMappedTexture/water_splash_0.png", "start": 21636589, "end": 21856339}, {"filename": "/game/Data/Textures/Material/carbon_1.png", "start": 21856339, "end": 21944214}, {"filename": "/game/Data/Textures/Material/cardboard_1.png", "start": 21944214, "end": 22152377}, {"filename": "/game/Data/Textures/Material/cartman.png", "start": 22152377, "end": 22468729}, {"filename": "/game/Data/Textures/Material/cloth_1.png", "start": 22468729, "end": 22738039}, {"filename": "/game/Data/Textures/Material/concrete_1.png", "start": 22738039, "end": 22922392}, {"filename": "/game/Data/Textures/Material/concrete_2.png", "start": 22922392, "end": 23131265}, {"filename": "/game/Data/Textures/Material/fiberglass_1.png", "start": 23131265, "end": 23430812}, {"filename": "/game/Data/Textures/Material/glass_1.png", "start": 23430812, "end": 23493412}, {"filename": "/game/Data/Textures/Material/lego_1.png", "start": 23493412, "end": 23500381}, {"filename": "/game/Data/Textures/Material/metal_bulkheads_1.png", "start": 23500381, "end": 23651668}, {"filename": "/game/Data/Textures/Material/metal_plates_1.png", "start": 23651668, "end": 23712713}, {"filename": "/game/Data/Textures/Material/metal_plates_1_small.png", "start": 23712713, "end": 23726077}, {"filename": "/game/Data/Textures/Material/metal_riveted_1.png", "start": 23726077, "end": 23772021}, {"filename": "/game/Data/Textures/Material/metal_riveted_1_small.png", "start": 23772021, "end": 23783966}, {"filename": "/game/Data/Textures/Material/metal_riveted_2.png", "start": 23783966, "end": 23789587}, {"filename": "/game/Data/Textures/Material/metal_riveted_2_small.png", "start": 23789587, "end": 23791364}, {"filename": "/game/Data/Textures/Material/none.png", "start": 23791364, "end": 23791483}, {"filename": "/game/Data/Textures/Material/paper_1.png", "start": 23791483, "end": 24070354}, {"filename": "/game/Data/Textures/Material/paper_2.png", "start": 24070354, "end": 24276830}, {"filename": "/game/Data/Textures/Material/rubber_1.png", "start": 24276830, "end": 24419549}, {"filename": "/game/Data/Textures/Material/styrofoam_1.png", "start": 24419549, "end": 24638072}, {"filename": "/game/Data/Textures/Material/wood_planks_1.png", "start": 24638072, "end": 24795859}, {"filename": "/game/Data/Textures/Material/wood_planks_2.png", "start": 24795859, "end": 24953711}, {"filename": "/game/Data/Textures/Material/wood_planks_3.png", "start": 24953711, "end": 25142187}, {"filename": "/game/Data/Textures/Material/wood_studded_1.png", "start": 25142187, "end": 25308038}, {"filename": "/game/Data/Textures/Material/wood_studded_2.png", "start": 25308038, "end": 25464712}, {"filename": "/game/Data/Textures/Noise/database.json", "start": 25464712, "end": 25464885}, {"filename": "/game/Data/Textures/Noise/noise_0.png", "start": 25464885, "end": 25482883}, {"filename": "/game/Data/Textures/Noise/noise_1.png", "start": 25482883, "end": 25550357}, {"filename": "/game/Data/Textures/ShipBuilderMipMappedTexture/center_of_buoyancy_0.png", "start": 25550357, "end": 25553284}, {"filename": "/game/Data/Textures/ShipBuilderMipMappedTexture/center_of_mass_1.png", "start": 25553284, "end": 25556253}, {"filename": "/game/Data/Textures/ShipBuilderMipMappedTexture/database.json", "start": 25556253, "end": 25556605}, {"filename": "/game/Data/Textures/ShipEnhancements/algaegrowth_1.png", "start": 25556605, "end": 43636471}, {"filename": "/game/Data/Textures/ShipEnhancements/database.json", "start": 43636471, "end": 43636681}, {"filename": "/game/Data/Textures/ShipEnhancements/rust_0.png", "start": 43636681, "end": 66723842}, {"filename": "/game/Data/Textures/World/database.json", "start": 66723842, "end": 66728140}, {"filename": "/game/Data/Textures/World/land_0.png", "start": 66728140, "end": 67081019}, {"filename": "/game/Data/Textures/World/land_1.png", "start": 67081019, "end": 67657394}, {"filename": "/game/Data/Textures/World/land_10.png", "start": 67657394, "end": 68308840}, {"filename": "/game/Data/Textures/World/land_11.png", "start": 68308840, "end": 68872240}, {"filename": "/game/Data/Textures/World/land_12.png", "start": 68872240, "end": 69440459}, {"filename": "/game/Data/Textures/World/land_14.png", "start": 69440459, "end": 70017625}, {"filename": "/game/Data/Textures/World/land_19.png", "start": 70017625, "end": 70414535}, {"filename": "/game/Data/Textures/World/land_2.png", "start": 70414535, "end": 70945026}, {"filename": "/game/Data/Textures/World/land_20.png", "start": 70945026, "end": 71382540}, {"filename": "/game/Data/Textures/World/land_3.png", "start": 71382540, "end": 73776184}, {"filename": "/game/Data/Textures/World/land_4.png", "start": 73776184, "end": 74391098}, {"filename": "/game/Data/Textures/World/land_5.png", "start": 74391098, "end": 74905204}, {"filename": "/game/Data/Textures/World/land_6.png", "start": 74905204, "end": 75505103}, {"filename": "/game/Data/Textures/World/land_7.png", "start": 75505103, "end": 76073096}, {"filename": "/game/Data/Textures/World/land_8.png", "start": 76073096, "end": 76726929}, {"filename": "/game/Data/Textures/World/land_9.png", "start": 76726929, "end": 77349538}, {"filename": "/game/Data/Textures/World/ocean_0.png", "start": 77349538, "end": 77958937}, {"filename": "/game/Data/Textures/World/ocean_1.png", "start": 77958937, "end": 78520528}, {"filename": "/game/Data/Textures/World/ocean_2.png", "start": 78520528, "end": 79071452}, {"filename": "/game/Data/Textures/World/ocean_4.png", "start": 79071452, "end": 79646048}, {"filename": "/game/Data/Textures/World/ocean_caribbean_0.png", "start": 79646048, "end": 79828529}, {"filename": "/game/Data/Textures/World/ocean_caribbean_1.png", "start": 79828529, "end": 80215938}, {"filename": "/game/Data/Textures/World/ocean_caribbean_2.png", "start": 80215938, "end": 80558101}, {"filename": "/game/Data/Textures/World/ocean_caribbean_3.png", "start": 80558101, "end": 80847327}, {"filename": "/game/Data/Textures/World/ocean_caribbean_4.png", "start": 80847327, "end": 81715084}, {"filename": "/game/Data/Textures/World/ocean_lava_0.png", "start": 81715084, "end": 81835700}, {"filename": "/game/Data/Textures/World/ocean_lava_1.png", "start": 81835700, "end": 81943725}], "remote_package_size": 81943725});

  })();

var moduleOverrides = Object.assign({}, Module);

var arguments_ = [];
var thisProgram = './this.program';
var quit_ = (status, toThrow) => {
  throw toThrow;
};

var ENVIRONMENT_IS_WEB = true;
var ENVIRONMENT_IS_WORKER = false;
var ENVIRONMENT_IS_NODE = false;
var ENVIRONMENT_IS_SHELL = false;

var scriptDirectory = '';
function locateFile(path) {
  if (Module['locateFile']) {
    return Module['locateFile'](path, scriptDirectory);
  }
  return scriptDirectory + path;
}

var read_,
    readAsync,
    readBinary;

if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  if (ENVIRONMENT_IS_WORKER) {
    scriptDirectory = self.location.href;
  } else if (typeof document != 'undefined' && document.currentScript) {
    scriptDirectory = document.currentScript.src;
  }

  if (scriptDirectory.indexOf('blob:') !== 0) {
    scriptDirectory = scriptDirectory.substr(0, scriptDirectory.replace(/[?#].*/, "").lastIndexOf('/')+1);
  } else {
    scriptDirectory = '';
  }

  {

read_ = (url) => {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send(null);
    return xhr.responseText;
  }

  if (ENVIRONMENT_IS_WORKER) {
    readBinary = (url) => {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, false);
      xhr.responseType = 'arraybuffer';
      xhr.send(null);
      return new Uint8Array( (xhr.response));
    };
  }

  readAsync = (url, onload, onerror) => {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = () => {
      if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) {
        onload(xhr.response);
        return;
      }
      onerror();
    };
    xhr.onerror = onerror;
    xhr.send(null);
  }

  }
} else
{
}

var out = Module['print'] || console.log.bind(console);
var err = Module['printErr'] || console.error.bind(console);

Object.assign(Module, moduleOverrides);

moduleOverrides = null;

if (Module['arguments']) arguments_ = Module['arguments'];

if (Module['thisProgram']) thisProgram = Module['thisProgram'];

if (Module['quit']) quit_ = Module['quit'];

var wasmBinary;
if (Module['wasmBinary']) wasmBinary = Module['wasmBinary'];

if (typeof WebAssembly != 'object') {
  abort('no native wasm support detected');
}

function intArrayFromBase64(s) {

  var decoded = atob(s);
  var bytes = new Uint8Array(decoded.length);
  for (var i = 0 ; i < decoded.length ; ++i) {
    bytes[i] = decoded.charCodeAt(i);
  }
  return bytes;
}

function tryParseAsDataURI(filename) {
  if (!isDataURI(filename)) {
    return;
  }

  return intArrayFromBase64(filename.slice(dataURIPrefix.length));
}

var wasmMemory;

var ABORT = false;

var EXITSTATUS;

function assert(condition, text) {
  if (!condition) {

    abort(text);
  }
}

var HEAP,

  HEAP8,

  HEAPU8,

  HEAP16,

  HEAPU16,

  HEAP32,

  HEAPU32,

  HEAPF32,

  HEAPF64;

function updateMemoryViews() {
  var b = wasmMemory.buffer;
  Module['HEAP8'] = HEAP8 = new Int8Array(b);
  Module['HEAP16'] = HEAP16 = new Int16Array(b);
  Module['HEAPU8'] = HEAPU8 = new Uint8Array(b);
  Module['HEAPU16'] = HEAPU16 = new Uint16Array(b);
  Module['HEAP32'] = HEAP32 = new Int32Array(b);
  Module['HEAPU32'] = HEAPU32 = new Uint32Array(b);
  Module['HEAPF32'] = HEAPF32 = new Float32Array(b);
  Module['HEAPF64'] = HEAPF64 = new Float64Array(b);
}

var __ATPRERUN__  = [];
var __ATINIT__    = [];
var __ATMAIN__    = [];
var __ATEXIT__    = [];
var __ATPOSTRUN__ = [];

var runtimeInitialized = false;

function preRun() {
  if (Module['preRun']) {
    if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']];
    while (Module['preRun'].length) {
      addOnPreRun(Module['preRun'].shift());
    }
  }
  callRuntimeCallbacks(__ATPRERUN__);
}

function initRuntime() {
  runtimeInitialized = true;

if (!Module["noFSInit"] && !FS.init.initialized)
  FS.init();
FS.ignorePermissions = false;

TTY.init();
  callRuntimeCallbacks(__ATINIT__);
}

function preMain() {

  callRuntimeCallbacks(__ATMAIN__);
}

function postRun() {

  if (Module['postRun']) {
    if (typeof Module['postRun'] == 'function') Module['postRun'] = [Module['postRun']];
    while (Module['postRun'].length) {
      addOnPostRun(Module['postRun'].shift());
    }
  }

  callRuntimeCallbacks(__ATPOSTRUN__);
}

function addOnPreRun(cb) {
  __ATPRERUN__.unshift(cb);
}

function addOnInit(cb) {
  __ATINIT__.unshift(cb);
}

function addOnPreMain(cb) {
  __ATMAIN__.unshift(cb);
}

function addOnExit(cb) {
}

function addOnPostRun(cb) {
  __ATPOSTRUN__.unshift(cb);
}

var runDependencies = 0;
var runDependencyWatcher = null;
var dependenciesFulfilled = null;

function getUniqueRunDependency(id) {
  return id;
}

function addRunDependency(id) {
  runDependencies++;

  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }

}

function removeRunDependency(id) {
  runDependencies--;

  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }

  if (runDependencies == 0) {
    if (runDependencyWatcher !== null) {
      clearInterval(runDependencyWatcher);
      runDependencyWatcher = null;
    }
    if (dependenciesFulfilled) {
      var callback = dependenciesFulfilled;
      dependenciesFulfilled = null;
      callback();
    }
  }
}

function abort(what) {
  if (Module['onAbort']) {
    Module['onAbort'](what);
  }

  what = 'Aborted(' + what + ')';

  err(what);

  ABORT = true;
  EXITSTATUS = 1;

  what += '. Build with -sASSERTIONS for more info.';

  var e = new WebAssembly.RuntimeError(what);

  throw e;
}

var dataURIPrefix = 'data:application/octet-stream;base64,';

var isDataURI = (filename) => filename.startsWith(dataURIPrefix);

var isFileURI = (filename) => filename.startsWith('file://');

var wasmBinaryFile;
  wasmBinaryFile = 'index.wasm';
  if (!isDataURI(wasmBinaryFile)) {
    wasmBinaryFile = locateFile(wasmBinaryFile);
  }

function getBinarySync(file) {
  if (file == wasmBinaryFile && wasmBinary) {
    return new Uint8Array(wasmBinary);
  }
  if (readBinary) {
    return readBinary(file);
  }
  throw "both async and sync fetching of the wasm failed";
}

function getBinaryPromise(binaryFile) {

  if (!wasmBinary
      && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) {
    if (typeof fetch == 'function'
    ) {
      return fetch(binaryFile, { credentials: 'same-origin' }).then((response) => {
        if (!response['ok']) {
          throw "failed to load wasm binary file at '" + binaryFile + "'";
        }
        return response['arrayBuffer']();
      }).catch(() => getBinarySync(binaryFile));
    }
  }

  return Promise.resolve().then(() => getBinarySync(binaryFile));
}

function instantiateArrayBuffer(binaryFile, imports, receiver) {
  return getBinaryPromise(binaryFile).then((binary) => {
    return WebAssembly.instantiate(binary, imports);
  }).then((instance) => {
    return instance;
  }).then(receiver, (reason) => {
    err(`failed to asynchronously prepare wasm: ${reason}`);

    abort(reason);
  });
}

function instantiateAsync(binary, binaryFile, imports, callback) {
  if (!binary &&
      typeof WebAssembly.instantiateStreaming == 'function' &&
      !isDataURI(binaryFile) &&
      typeof fetch == 'function') {
    return fetch(binaryFile, { credentials: 'same-origin' }).then((response) => {

      var result = WebAssembly.instantiateStreaming(response, imports);

      return result.then(
        callback,
        function(reason) {

          err(`wasm streaming compile failed: ${reason}`);
          err('falling back to ArrayBuffer instantiation');
          return instantiateArrayBuffer(binaryFile, imports, callback);
        });
    });
  }
  return instantiateArrayBuffer(binaryFile, imports, callback);
}

function createWasm() {

  var info = {
    'env': wasmImports,
    'wasi_snapshot_preview1': wasmImports,
  };

  function receiveInstance(instance, module) {
    wasmExports = instance.exports;

    wasmMemory = wasmExports['memory'];

    updateMemoryViews();

    wasmTable = wasmExports['__indirect_function_table'];

    addOnInit(wasmExports['__wasm_call_ctors']);

    removeRunDependency('wasm-instantiate');
    return wasmExports;
  }

  addRunDependency('wasm-instantiate');

  function receiveInstantiationResult(result) {

    receiveInstance(result['instance']);
  }

  if (Module['instantiateWasm']) {

    try {
      return Module['instantiateWasm'](info, receiveInstance);
    } catch(e) {
      err(`Module.instantiateWasm callback failed with error: ${e}`);
        return false;
    }
  }

  instantiateAsync(wasmBinary, wasmBinaryFile, info, receiveInstantiationResult);
  return {};
}

var tempDouble;
var tempI64;

var ASM_CONSTS = {
  5373840: () => { if (window.FSAudio) { FSAudio.loop('tool', '', 0, 0); } },
 5373900: ($0, $1) => { if (window.FSAudio) { FSAudio.loop('tool', UTF8ToString($0), $1, 0.7); } },
 5373977: ($0) => { if (Module.onGameError) { Module.onGameError(UTF8ToString($0)); } },
 5374047: ($0) => { if (Module.onGameProgress) { Module.onGameProgress($0); } },
 5374109: ($0, $1, $2, $3, $4) => { if (window.FSAudio) { FSAudio.playMaterial(UTF8ToString($0), UTF8ToString($1), $2, $3, $4); } },
 5374207: ($0, $1) => { if (window.FSAudio) { FSAudio.playBase(UTF8ToString($0), $1); } },
 5374275: ($0, $1, $2) => { if (window.FSAudio) { FSAudio.playUnderwater(UTF8ToString($0), $1, $2); } },
 5374353: ($0) => { if (window.FSAudio) { FSAudio.playUnderwater('physicsprobeattached', $0, 1.0); } },
 5374438: ($0) => { if (window.FSAudio) { FSAudio.playUnderwater('bombattached', $0, 1.0); } },
 5374515: ($0) => { if (window.FSAudio) { FSAudio.playUnderwater('physicsprobedetached', $0, 1.0); } },
 5374600: ($0) => { if (window.FSAudio) { FSAudio.playUnderwater('bombdetached', $0, 1.0); } },
 5374677: ($0, $1) => { if (window.FSAudio) { FSAudio.playUnderwater(UTF8ToString($0), $1, 1.0); } },
 5374756: ($0) => { if (window.FSAudio) { FSAudio.playUnderwater('rcbombping', $0, 0.7); } },
 5374831: ($0) => { if (window.FSAudio) { FSAudio.playUnderwater('combustionexplosion', $0, 1.0); } },
 5374915: () => { if (window.FSAudio) { FSAudio.loop('storm', 'rain', 1, 0.5); } },
 5374982: () => { if (window.FSAudio) { FSAudio.loop('storm', 'rain', 0, 0); } },
 5375047: () => { if (Module.onGameReady) { Module.onGameReady(); } }
};

  function ExitStatus(status) {
      this.name = 'ExitStatus';
      this.message = `Program terminated with exit(${status})`;
      this.status = status;
    }

  var callRuntimeCallbacks = (callbacks) => {
      while (callbacks.length > 0) {

        callbacks.shift()(Module);
      }
    };

  function getValue(ptr, type = 'i8') {
    if (type.endsWith('*')) type = '*';
    switch (type) {
      case 'i1': return HEAP8[((ptr)>>0)];
      case 'i8': return HEAP8[((ptr)>>0)];
      case 'i16': return HEAP16[((ptr)>>1)];
      case 'i32': return HEAP32[((ptr)>>2)];
      case 'i64': abort('to do getValue(i64) use WASM_BIGINT');
      case 'float': return HEAPF32[((ptr)>>2)];
      case 'double': return HEAPF64[((ptr)>>3)];
      case '*': return HEAPU32[((ptr)>>2)];
      default: abort(`invalid type for getValue: ${type}`);
    }
  }

  var noExitRuntime = Module['noExitRuntime'] || true;

  function setValue(ptr, value, type = 'i8') {
    if (type.endsWith('*')) type = '*';
    switch (type) {
      case 'i1': HEAP8[((ptr)>>0)] = value; break;
      case 'i8': HEAP8[((ptr)>>0)] = value; break;
      case 'i16': HEAP16[((ptr)>>1)] = value; break;
      case 'i32': HEAP32[((ptr)>>2)] = value; break;
      case 'i64': abort('to do setValue(i64) use WASM_BIGINT');
      case 'float': HEAPF32[((ptr)>>2)] = value; break;
      case 'double': HEAPF64[((ptr)>>3)] = value; break;
      case '*': HEAPU32[((ptr)>>2)] = value; break;
      default: abort(`invalid type for setValue: ${type}`);
    }
  }

  var exceptionCaught =  [];

  var uncaughtExceptionCount = 0;
  var ___cxa_begin_catch = (ptr) => {
      var info = new ExceptionInfo(ptr);
      if (!info.get_caught()) {
        info.set_caught(true);
        uncaughtExceptionCount--;
      }
      info.set_rethrown(false);
      exceptionCaught.push(info);
      ___cxa_increment_exception_refcount(info.excPtr);
      return info.get_exception_ptr();
    };

  var exceptionLast = 0;

  var ___cxa_end_catch = () => {

      _setThrew(0, 0);

      var info = exceptionCaught.pop();

      ___cxa_decrement_exception_refcount(info.excPtr);
      exceptionLast = 0;
    };

  function ExceptionInfo(excPtr) {
      this.excPtr = excPtr;
      this.ptr = excPtr - 24;

      this.set_type = function(type) {
        HEAPU32[(((this.ptr)+(4))>>2)] = type;
      };

      this.get_type = function() {
        return HEAPU32[(((this.ptr)+(4))>>2)];
      };

      this.set_destructor = function(destructor) {
        HEAPU32[(((this.ptr)+(8))>>2)] = destructor;
      };

      this.get_destructor = function() {
        return HEAPU32[(((this.ptr)+(8))>>2)];
      };

      this.set_caught = function(caught) {
        caught = caught ? 1 : 0;
        HEAP8[(((this.ptr)+(12))>>0)] = caught;
      };

      this.get_caught = function() {
        return HEAP8[(((this.ptr)+(12))>>0)] != 0;
      };

      this.set_rethrown = function(rethrown) {
        rethrown = rethrown ? 1 : 0;
        HEAP8[(((this.ptr)+(13))>>0)] = rethrown;
      };

      this.get_rethrown = function() {
        return HEAP8[(((this.ptr)+(13))>>0)] != 0;
      };

      this.init = function(type, destructor) {
        this.set_adjusted_ptr(0);
        this.set_type(type);
        this.set_destructor(destructor);
      }

      this.set_adjusted_ptr = function(adjustedPtr) {
        HEAPU32[(((this.ptr)+(16))>>2)] = adjustedPtr;
      };

      this.get_adjusted_ptr = function() {
        return HEAPU32[(((this.ptr)+(16))>>2)];
      };

      this.get_exception_ptr = function() {

        var isPointer = ___cxa_is_pointer_type(this.get_type());
        if (isPointer) {
          return HEAPU32[((this.excPtr)>>2)];
        }
        var adjusted = this.get_adjusted_ptr();
        if (adjusted !== 0) return adjusted;
        return this.excPtr;
      };
    }

  var ___resumeException = (ptr) => {
      if (!exceptionLast) {
        exceptionLast = ptr;
      }
      throw exceptionLast;
    };

  var findMatchingCatch = (args) => {
      var thrown =
        exceptionLast;
      if (!thrown) {

        setTempRet0(0);
        return 0;
      }
      var info = new ExceptionInfo(thrown);
      info.set_adjusted_ptr(thrown);
      var thrownType = info.get_type();
      if (!thrownType) {

        setTempRet0(0);
        return thrown;
      }

      for (var arg in args) {
        var caughtType = args[arg];

        if (caughtType === 0 || caughtType === thrownType) {

          break;
        }
        var adjusted_ptr_addr = info.ptr + 16;
        if (___cxa_can_catch(caughtType, thrownType, adjusted_ptr_addr)) {
          setTempRet0(caughtType);
          return thrown;
        }
      }
      setTempRet0(thrownType);
      return thrown;
    };
  var ___cxa_find_matching_catch_2 = () => findMatchingCatch([]);

  var ___cxa_find_matching_catch_3 = (arg0) => findMatchingCatch([arg0]);

  var ___cxa_find_matching_catch_5 = (arg0,arg1,arg2) => findMatchingCatch([arg0,arg1,arg2]);

  var ___cxa_rethrow = () => {
      var info = exceptionCaught.pop();
      if (!info) {
        abort('no exception to throw');
      }
      var ptr = info.excPtr;
      if (!info.get_rethrown()) {

        exceptionCaught.push(info);
        info.set_rethrown(true);
        info.set_caught(false);
        uncaughtExceptionCount++;
      }
      exceptionLast = ptr;
      throw exceptionLast;
    };

  var ___cxa_throw = (ptr, type, destructor) => {
      var info = new ExceptionInfo(ptr);

      info.init(type, destructor);
      exceptionLast = ptr;
      uncaughtExceptionCount++;
      throw exceptionLast;
    };

  var ___cxa_uncaught_exceptions = () => uncaughtExceptionCount;

  var setErrNo = (value) => {
      HEAP32[((___errno_location())>>2)] = value;
      return value;
    };

  var PATH = {
  isAbs:(path) => path.charAt(0) === '/',
  splitPath:(filename) => {
        var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
        return splitPathRe.exec(filename).slice(1);
      },
  normalizeArray:(parts, allowAboveRoot) => {

        var up = 0;
        for (var i = parts.length - 1; i >= 0; i--) {
          var last = parts[i];
          if (last === '.') {
            parts.splice(i, 1);
          } else if (last === '..') {
            parts.splice(i, 1);
            up++;
          } else if (up) {
            parts.splice(i, 1);
            up--;
          }
        }

        if (allowAboveRoot) {
          for (; up; up--) {
            parts.unshift('..');
          }
        }
        return parts;
      },
  normalize:(path) => {
        var isAbsolute = PATH.isAbs(path),
            trailingSlash = path.substr(-1) === '/';

        path = PATH.normalizeArray(path.split('/').filter((p) => !!p), !isAbsolute).join('/');
        if (!path && !isAbsolute) {
          path = '.';
        }
        if (path && trailingSlash) {
          path += '/';
        }
        return (isAbsolute ? '/' : '') + path;
      },
  dirname:(path) => {
        var result = PATH.splitPath(path),
            root = result[0],
            dir = result[1];
        if (!root && !dir) {

          return '.';
        }
        if (dir) {

          dir = dir.substr(0, dir.length - 1);
        }
        return root + dir;
      },
  basename:(path) => {

        if (path === '/') return '/';
        path = PATH.normalize(path);
        path = path.replace(/\/$/, "");
        var lastSlash = path.lastIndexOf('/');
        if (lastSlash === -1) return path;
        return path.substr(lastSlash+1);
      },
  join:function() {
        var paths = Array.prototype.slice.call(arguments);
        return PATH.normalize(paths.join('/'));
      },
  join2:(l, r) => PATH.normalize(l + '/' + r),
  };

  var initRandomFill = () => {
      if (typeof crypto == 'object' && typeof crypto['getRandomValues'] == 'function') {

        return (view) => crypto.getRandomValues(view);
      } else

      abort("initRandomDevice");
    };
  var randomFill = (view) => {

      return (randomFill = initRandomFill())(view);
    };

  var PATH_FS = {
  resolve:function() {
        var resolvedPath = '',
          resolvedAbsolute = false;
        for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
          var path = (i >= 0) ? arguments[i] : FS.cwd();

          if (typeof path != 'string') {
            throw new TypeError('Arguments to path.resolve must be strings');
          } else if (!path) {
            return '';
          }
          resolvedPath = path + '/' + resolvedPath;
          resolvedAbsolute = PATH.isAbs(path);
        }

        resolvedPath = PATH.normalizeArray(resolvedPath.split('/').filter((p) => !!p), !resolvedAbsolute).join('/');
        return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
      },
  relative:(from, to) => {
        from = PATH_FS.resolve(from).substr(1);
        to = PATH_FS.resolve(to).substr(1);
        function trim(arr) {
          var start = 0;
          for (; start < arr.length; start++) {
            if (arr[start] !== '') break;
          }
          var end = arr.length - 1;
          for (; end >= 0; end--) {
            if (arr[end] !== '') break;
          }
          if (start > end) return [];
          return arr.slice(start, end - start + 1);
        }
        var fromParts = trim(from.split('/'));
        var toParts = trim(to.split('/'));
        var length = Math.min(fromParts.length, toParts.length);
        var samePartsLength = length;
        for (var i = 0; i < length; i++) {
          if (fromParts[i] !== toParts[i]) {
            samePartsLength = i;
            break;
          }
        }
        var outputParts = [];
        for (var i = samePartsLength; i < fromParts.length; i++) {
          outputParts.push('..');
        }
        outputParts = outputParts.concat(toParts.slice(samePartsLength));
        return outputParts.join('/');
      },
  };

  var UTF8Decoder = typeof TextDecoder != 'undefined' ? new TextDecoder('utf8') : undefined;

  var UTF8ArrayToString = (heapOrArray, idx, maxBytesToRead) => {
      var endIdx = idx + maxBytesToRead;
      var endPtr = idx;

      while (heapOrArray[endPtr] && !(endPtr >= endIdx)) ++endPtr;

      if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
        return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr));
      }
      var str = '';

      while (idx < endPtr) {

        var u0 = heapOrArray[idx++];
        if (!(u0 & 0x80)) { str += String.fromCharCode(u0); continue; }
        var u1 = heapOrArray[idx++] & 63;
        if ((u0 & 0xE0) == 0xC0) { str += String.fromCharCode(((u0 & 31) << 6) | u1); continue; }
        var u2 = heapOrArray[idx++] & 63;
        if ((u0 & 0xF0) == 0xE0) {
          u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
        } else {
          u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (heapOrArray[idx++] & 63);
        }

        if (u0 < 0x10000) {
          str += String.fromCharCode(u0);
        } else {
          var ch = u0 - 0x10000;
          str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
        }
      }
      return str;
    };

  var FS_stdin_getChar_buffer = [];

  var lengthBytesUTF8 = (str) => {
      var len = 0;
      for (var i = 0; i < str.length; ++i) {

        var c = str.charCodeAt(i);
        if (c <= 0x7F) {
          len++;
        } else if (c <= 0x7FF) {
          len += 2;
        } else if (c >= 0xD800 && c <= 0xDFFF) {
          len += 4; ++i;
        } else {
          len += 3;
        }
      }
      return len;
    };

  var stringToUTF8Array = (str, heap, outIdx, maxBytesToWrite) => {

      if (!(maxBytesToWrite > 0))
        return 0;

      var startIdx = outIdx;
      var endIdx = outIdx + maxBytesToWrite - 1;
      for (var i = 0; i < str.length; ++i) {

        var u = str.charCodeAt(i);
        if (u >= 0xD800 && u <= 0xDFFF) {
          var u1 = str.charCodeAt(++i);
          u = 0x10000 + ((u & 0x3FF) << 10) | (u1 & 0x3FF);
        }
        if (u <= 0x7F) {
          if (outIdx >= endIdx) break;
          heap[outIdx++] = u;
        } else if (u <= 0x7FF) {
          if (outIdx + 1 >= endIdx) break;
          heap[outIdx++] = 0xC0 | (u >> 6);
          heap[outIdx++] = 0x80 | (u & 63);
        } else if (u <= 0xFFFF) {
          if (outIdx + 2 >= endIdx) break;
          heap[outIdx++] = 0xE0 | (u >> 12);
          heap[outIdx++] = 0x80 | ((u >> 6) & 63);
          heap[outIdx++] = 0x80 | (u & 63);
        } else {
          if (outIdx + 3 >= endIdx) break;
          heap[outIdx++] = 0xF0 | (u >> 18);
          heap[outIdx++] = 0x80 | ((u >> 12) & 63);
          heap[outIdx++] = 0x80 | ((u >> 6) & 63);
          heap[outIdx++] = 0x80 | (u & 63);
        }
      }

      heap[outIdx] = 0;
      return outIdx - startIdx;
    };

  function intArrayFromString(stringy, dontAddNull, length) {
    var len = length > 0 ? length : lengthBytesUTF8(stringy)+1;
    var u8array = new Array(len);
    var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
    if (dontAddNull) u8array.length = numBytesWritten;
    return u8array;
  }
  var FS_stdin_getChar = () => {
      if (!FS_stdin_getChar_buffer.length) {
        var result = null;
        if (typeof window != 'undefined' &&
          typeof window.prompt == 'function') {

          result = window.prompt('Input: ');
          if (result !== null) {
            result += '\n';
          }
        } else if (typeof readline == 'function') {

          result = readline();
          if (result !== null) {
            result += '\n';
          }
        }
        if (!result) {
          return null;
        }
        FS_stdin_getChar_buffer = intArrayFromString(result, true);
      }
      return FS_stdin_getChar_buffer.shift();
    };
  var TTY = {
  ttys:[],
  init() {

      },
  shutdown() {

      },
  register(dev, ops) {
        TTY.ttys[dev] = { input: [], output: [], ops: ops };
        FS.registerDevice(dev, TTY.stream_ops);
      },
  stream_ops:{
  open(stream) {
          var tty = TTY.ttys[stream.node.rdev];
          if (!tty) {
            throw new FS.ErrnoError(43);
          }
          stream.tty = tty;
          stream.seekable = false;
        },
  close(stream) {

          stream.tty.ops.fsync(stream.tty);
        },
  fsync(stream) {
          stream.tty.ops.fsync(stream.tty);
        },
  read(stream, buffer, offset, length, pos  ) {
          if (!stream.tty || !stream.tty.ops.get_char) {
            throw new FS.ErrnoError(60);
          }
          var bytesRead = 0;
          for (var i = 0; i < length; i++) {
            var result;
            try {
              result = stream.tty.ops.get_char(stream.tty);
            } catch (e) {
              throw new FS.ErrnoError(29);
            }
            if (result === undefined && bytesRead === 0) {
              throw new FS.ErrnoError(6);
            }
            if (result === null || result === undefined) break;
            bytesRead++;
            buffer[offset+i] = result;
          }
          if (bytesRead) {
            stream.node.timestamp = Date.now();
          }
          return bytesRead;
        },
  write(stream, buffer, offset, length, pos) {
          if (!stream.tty || !stream.tty.ops.put_char) {
            throw new FS.ErrnoError(60);
          }
          try {
            for (var i = 0; i < length; i++) {
              stream.tty.ops.put_char(stream.tty, buffer[offset+i]);
            }
          } catch (e) {
            throw new FS.ErrnoError(29);
          }
          if (length) {
            stream.node.timestamp = Date.now();
          }
          return i;
        },
  },
  default_tty_ops:{
  get_char(tty) {
          return FS_stdin_getChar();
        },
  put_char(tty, val) {
          if (val === null || val === 10) {
            out(UTF8ArrayToString(tty.output, 0));
            tty.output = [];
          } else {
            if (val != 0) tty.output.push(val);
          }
        },
  fsync(tty) {
          if (tty.output && tty.output.length > 0) {
            out(UTF8ArrayToString(tty.output, 0));
            tty.output = [];
          }
        },
  ioctl_tcgets(tty) {

          return {
            c_iflag: 25856,
            c_oflag: 5,
            c_cflag: 191,
            c_lflag: 35387,
            c_cc: [
              0x03, 0x1c, 0x7f, 0x15, 0x04, 0x00, 0x01, 0x00, 0x11, 0x13, 0x1a, 0x00,
              0x12, 0x0f, 0x17, 0x16, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
              0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            ]
          };
        },
  ioctl_tcsets(tty, optional_actions, data) {

          return 0;
        },
  ioctl_tiocgwinsz(tty) {
          return [24, 80];
        },
  },
  default_tty1_ops:{
  put_char(tty, val) {
          if (val === null || val === 10) {
            err(UTF8ArrayToString(tty.output, 0));
            tty.output = [];
          } else {
            if (val != 0) tty.output.push(val);
          }
        },
  fsync(tty) {
          if (tty.output && tty.output.length > 0) {
            err(UTF8ArrayToString(tty.output, 0));
            tty.output = [];
          }
        },
  },
  };

  var zeroMemory = (address, size) => {
      HEAPU8.fill(0, address, address + size);
      return address;
    };

  var alignMemory = (size, alignment) => {
      return Math.ceil(size / alignment) * alignment;
    };
  var mmapAlloc = (size) => {
      abort();
    };
  var MEMFS = {
  ops_table:null,
  mount(mount) {
        return MEMFS.createNode(null, '/', 16384 | 511  , 0);
      },
  createNode(parent, name, mode, dev) {
        if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {

          throw new FS.ErrnoError(63);
        }
        if (!MEMFS.ops_table) {
          MEMFS.ops_table = {
            dir: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr,
                lookup: MEMFS.node_ops.lookup,
                mknod: MEMFS.node_ops.mknod,
                rename: MEMFS.node_ops.rename,
                unlink: MEMFS.node_ops.unlink,
                rmdir: MEMFS.node_ops.rmdir,
                readdir: MEMFS.node_ops.readdir,
                symlink: MEMFS.node_ops.symlink
              },
              stream: {
                llseek: MEMFS.stream_ops.llseek
              }
            },
            file: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr
              },
              stream: {
                llseek: MEMFS.stream_ops.llseek,
                read: MEMFS.stream_ops.read,
                write: MEMFS.stream_ops.write,
                allocate: MEMFS.stream_ops.allocate,
                mmap: MEMFS.stream_ops.mmap,
                msync: MEMFS.stream_ops.msync
              }
            },
            link: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr,
                readlink: MEMFS.node_ops.readlink
              },
              stream: {}
            },
            chrdev: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr
              },
              stream: FS.chrdev_stream_ops
            }
          };
        }
        var node = FS.createNode(parent, name, mode, dev);
        if (FS.isDir(node.mode)) {
          node.node_ops = MEMFS.ops_table.dir.node;
          node.stream_ops = MEMFS.ops_table.dir.stream;
          node.contents = {};
        } else if (FS.isFile(node.mode)) {
          node.node_ops = MEMFS.ops_table.file.node;
          node.stream_ops = MEMFS.ops_table.file.stream;
          node.usedBytes = 0;

          node.contents = null;
        } else if (FS.isLink(node.mode)) {
          node.node_ops = MEMFS.ops_table.link.node;
          node.stream_ops = MEMFS.ops_table.link.stream;
        } else if (FS.isChrdev(node.mode)) {
          node.node_ops = MEMFS.ops_table.chrdev.node;
          node.stream_ops = MEMFS.ops_table.chrdev.stream;
        }
        node.timestamp = Date.now();

        if (parent) {
          parent.contents[name] = node;
          parent.timestamp = node.timestamp;
        }
        return node;
      },
  getFileDataAsTypedArray(node) {
        if (!node.contents) return new Uint8Array(0);
        if (node.contents.subarray) return node.contents.subarray(0, node.usedBytes);
        return new Uint8Array(node.contents);
      },
  expandFileStorage(node, newCapacity) {
        var prevCapacity = node.contents ? node.contents.length : 0;
        if (prevCapacity >= newCapacity) return;

        var CAPACITY_DOUBLING_MAX = 1024 * 1024;
        newCapacity = Math.max(newCapacity, (prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2.0 : 1.125)) >>> 0);
        if (prevCapacity != 0) newCapacity = Math.max(newCapacity, 256);
        var oldContents = node.contents;
        node.contents = new Uint8Array(newCapacity);
        if (node.usedBytes > 0) node.contents.set(oldContents.subarray(0, node.usedBytes), 0);
      },
  resizeFileStorage(node, newSize) {
        if (node.usedBytes == newSize) return;
        if (newSize == 0) {
          node.contents = null;
          node.usedBytes = 0;
        } else {
          var oldContents = node.contents;
          node.contents = new Uint8Array(newSize);
          if (oldContents) {
            node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes)));
          }
          node.usedBytes = newSize;
        }
      },
  node_ops:{
  getattr(node) {
          var attr = {};

          attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
          attr.ino = node.id;
          attr.mode = node.mode;
          attr.nlink = 1;
          attr.uid = 0;
          attr.gid = 0;
          attr.rdev = node.rdev;
          if (FS.isDir(node.mode)) {
            attr.size = 4096;
          } else if (FS.isFile(node.mode)) {
            attr.size = node.usedBytes;
          } else if (FS.isLink(node.mode)) {
            attr.size = node.link.length;
          } else {
            attr.size = 0;
          }
          attr.atime = new Date(node.timestamp);
          attr.mtime = new Date(node.timestamp);
          attr.ctime = new Date(node.timestamp);

          attr.blksize = 4096;
          attr.blocks = Math.ceil(attr.size / attr.blksize);
          return attr;
        },
  setattr(node, attr) {
          if (attr.mode !== undefined) {
            node.mode = attr.mode;
          }
          if (attr.timestamp !== undefined) {
            node.timestamp = attr.timestamp;
          }
          if (attr.size !== undefined) {
            MEMFS.resizeFileStorage(node, attr.size);
          }
        },
  lookup(parent, name) {
          throw FS.genericErrors[44];
        },
  mknod(parent, name, mode, dev) {
          return MEMFS.createNode(parent, name, mode, dev);
        },
  rename(old_node, new_dir, new_name) {

          if (FS.isDir(old_node.mode)) {
            var new_node;
            try {
              new_node = FS.lookupNode(new_dir, new_name);
            } catch (e) {
            }
            if (new_node) {
              for (var i in new_node.contents) {
                throw new FS.ErrnoError(55);
              }
            }
          }

          delete old_node.parent.contents[old_node.name];
          old_node.parent.timestamp = Date.now()
          old_node.name = new_name;
          new_dir.contents[new_name] = old_node;
          new_dir.timestamp = old_node.parent.timestamp;
          old_node.parent = new_dir;
        },
  unlink(parent, name) {
          delete parent.contents[name];
          parent.timestamp = Date.now();
        },
  rmdir(parent, name) {
          var node = FS.lookupNode(parent, name);
          for (var i in node.contents) {
            throw new FS.ErrnoError(55);
          }
          delete parent.contents[name];
          parent.timestamp = Date.now();
        },
  readdir(node) {
          var entries = ['.', '..'];
          for (var key in node.contents) {
            if (!node.contents.hasOwnProperty(key)) {
              continue;
            }
            entries.push(key);
          }
          return entries;
        },
  symlink(parent, newname, oldpath) {
          var node = MEMFS.createNode(parent, newname, 511   | 40960, 0);
          node.link = oldpath;
          return node;
        },
  readlink(node) {
          if (!FS.isLink(node.mode)) {
            throw new FS.ErrnoError(28);
          }
          return node.link;
        },
  },
  stream_ops:{
  read(stream, buffer, offset, length, position) {
          var contents = stream.node.contents;
          if (position >= stream.node.usedBytes) return 0;
          var size = Math.min(stream.node.usedBytes - position, length);
          if (size > 8 && contents.subarray) {
            buffer.set(contents.subarray(position, position + size), offset);
          } else {
            for (var i = 0; i < size; i++) buffer[offset + i] = contents[position + i];
          }
          return size;
        },
  write(stream, buffer, offset, length, position, canOwn) {

          if (buffer.buffer === HEAP8.buffer) {
            canOwn = false;
          }

          if (!length) return 0;
          var node = stream.node;
          node.timestamp = Date.now();

          if (buffer.subarray && (!node.contents || node.contents.subarray)) {
            if (canOwn) {
              node.contents = buffer.subarray(offset, offset + length);
              node.usedBytes = length;
              return length;
            } else if (node.usedBytes === 0 && position === 0) {
              node.contents = buffer.slice(offset, offset + length);
              node.usedBytes = length;
              return length;
            } else if (position + length <= node.usedBytes) {
              node.contents.set(buffer.subarray(offset, offset + length), position);
              return length;
            }
          }

          MEMFS.expandFileStorage(node, position+length);
          if (node.contents.subarray && buffer.subarray) {

            node.contents.set(buffer.subarray(offset, offset + length), position);
          } else {
            for (var i = 0; i < length; i++) {
             node.contents[position + i] = buffer[offset + i];
            }
          }
          node.usedBytes = Math.max(node.usedBytes, position + length);
          return length;
        },
  llseek(stream, offset, whence) {
          var position = offset;
          if (whence === 1) {
            position += stream.position;
          } else if (whence === 2) {
            if (FS.isFile(stream.node.mode)) {
              position += stream.node.usedBytes;
            }
          }
          if (position < 0) {
            throw new FS.ErrnoError(28);
          }
          return position;
        },
  allocate(stream, offset, length) {
          MEMFS.expandFileStorage(stream.node, offset + length);
          stream.node.usedBytes = Math.max(stream.node.usedBytes, offset + length);
        },
  mmap(stream, length, position, prot, flags) {
          if (!FS.isFile(stream.node.mode)) {
            throw new FS.ErrnoError(43);
          }
          var ptr;
          var allocated;
          var contents = stream.node.contents;

          if (!(flags & 2) && contents.buffer === HEAP8.buffer) {

            allocated = false;
            ptr = contents.byteOffset;
          } else {

            if (position > 0 || position + length < contents.length) {
              if (contents.subarray) {
                contents = contents.subarray(position, position + length);
              } else {
                contents = Array.prototype.slice.call(contents, position, position + length);
              }
            }
            allocated = true;
            ptr = mmapAlloc(length);
            if (!ptr) {
              throw new FS.ErrnoError(48);
            }
            HEAP8.set(contents, ptr);
          }
          return { ptr, allocated };
        },
  msync(stream, buffer, offset, length, mmapFlags) {
          MEMFS.stream_ops.write(stream, buffer, 0, length, offset, false);

          return 0;
        },
  },
  };

  var asyncLoad = (url, onload, onerror, noRunDep) => {
      var dep = !noRunDep ? getUniqueRunDependency(`al ${url}`) : '';
      readAsync(url, (arrayBuffer) => {
        assert(arrayBuffer, `Loading data file "${url}" failed (no arrayBuffer).`);
        onload(new Uint8Array(arrayBuffer));
        if (dep) removeRunDependency(dep);
      }, (event) => {
        if (onerror) {
          onerror();
        } else {
          throw `Loading data file "${url}" failed.`;
        }
      });
      if (dep) addRunDependency(dep);
    };

  var FS_createDataFile = (parent, name, fileData, canRead, canWrite, canOwn) => {
      FS.createDataFile(parent, name, fileData, canRead, canWrite, canOwn);
    };

  var preloadPlugins = Module['preloadPlugins'] || [];
  var FS_handledByPreloadPlugin = (byteArray, fullname, finish, onerror) => {

      if (typeof Browser != 'undefined') Browser.init();

      var handled = false;
      preloadPlugins.forEach((plugin) => {
        if (handled) return;
        if (plugin['canHandle'](fullname)) {
          plugin['handle'](byteArray, fullname, finish, onerror);
          handled = true;
        }
      });
      return handled;
    };
  var FS_createPreloadedFile = (parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish) => {

      var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent;
      var dep = getUniqueRunDependency(`cp ${fullname}`);
      function processData(byteArray) {
        function finish(byteArray) {
          if (preFinish) preFinish();
          if (!dontCreateFile) {
            FS_createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
          }
          if (onload) onload();
          removeRunDependency(dep);
        }
        if (FS_handledByPreloadPlugin(byteArray, fullname, finish, () => {
          if (onerror) onerror();
          removeRunDependency(dep);
        })) {
          return;
        }
        finish(byteArray);
      }
      addRunDependency(dep);
      if (typeof url == 'string') {
        asyncLoad(url, (byteArray) => processData(byteArray), onerror);
      } else {
        processData(url);
      }
    };

  var FS_modeStringToFlags = (str) => {
      var flagModes = {
        'r': 0,
        'r+': 2,
        'w': 512 | 64 | 1,
        'w+': 512 | 64 | 2,
        'a': 1024 | 64 | 1,
        'a+': 1024 | 64 | 2,
      };
      var flags = flagModes[str];
      if (typeof flags == 'undefined') {
        throw new Error(`Unknown file open mode: ${str}`);
      }
      return flags;
    };

  var FS_getMode = (canRead, canWrite) => {
      var mode = 0;
      if (canRead) mode |= 292 | 73;
      if (canWrite) mode |= 146;
      return mode;
    };

  var FS = {
  root:null,
  mounts:[],
  devices:{
  },
  streams:[],
  nextInode:1,
  nameTable:null,
  currentPath:"/",
  initialized:false,
  ignorePermissions:true,
  ErrnoError:null,
  genericErrors:{
  },
  filesystems:null,
  syncFSRequests:0,
  lookupPath(path, opts = {}) {
        path = PATH_FS.resolve(path);

        if (!path) return { path: '', node: null };

        var defaults = {
          follow_mount: true,
          recurse_count: 0
        };
        opts = Object.assign(defaults, opts)

        if (opts.recurse_count > 8) {
          throw new FS.ErrnoError(32);
        }

        var parts = path.split('/').filter((p) => !!p);

        var current = FS.root;
        var current_path = '/';

        for (var i = 0; i < parts.length; i++) {
          var islast = (i === parts.length-1);
          if (islast && opts.parent) {

            break;
          }

          current = FS.lookupNode(current, parts[i]);
          current_path = PATH.join2(current_path, parts[i]);

          if (FS.isMountpoint(current)) {
            if (!islast || (islast && opts.follow_mount)) {
              current = current.mounted.root;
            }
          }

          if (!islast || opts.follow) {
            var count = 0;
            while (FS.isLink(current.mode)) {
              var link = FS.readlink(current_path);
              current_path = PATH_FS.resolve(PATH.dirname(current_path), link);

              var lookup = FS.lookupPath(current_path, { recurse_count: opts.recurse_count + 1 });
              current = lookup.node;

              if (count++ > 40) {
                throw new FS.ErrnoError(32);
              }
            }
          }
        }

        return { path: current_path, node: current };
      },
  getPath(node) {
        var path;
        while (true) {
          if (FS.isRoot(node)) {
            var mount = node.mount.mountpoint;
            if (!path) return mount;
            return mount[mount.length-1] !== '/' ? `${mount}/${path}` : mount + path;
          }
          path = path ? `${node.name}/${path}` : node.name;
          node = node.parent;
        }
      },
  hashName(parentid, name) {
        var hash = 0;

        for (var i = 0; i < name.length; i++) {
          hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
        }
        return ((parentid + hash) >>> 0) % FS.nameTable.length;
      },
  hashAddNode(node) {
        var hash = FS.hashName(node.parent.id, node.name);
        node.name_next = FS.nameTable[hash];
        FS.nameTable[hash] = node;
      },
  hashRemoveNode(node) {
        var hash = FS.hashName(node.parent.id, node.name);
        if (FS.nameTable[hash] === node) {
          FS.nameTable[hash] = node.name_next;
        } else {
          var current = FS.nameTable[hash];
          while (current) {
            if (current.name_next === node) {
              current.name_next = node.name_next;
              break;
            }
            current = current.name_next;
          }
        }
      },
  lookupNode(parent, name) {
        var errCode = FS.mayLookup(parent);
        if (errCode) {
          throw new FS.ErrnoError(errCode, parent);
        }
        var hash = FS.hashName(parent.id, name);
        for (var node = FS.nameTable[hash]; node; node = node.name_next) {
          var nodeName = node.name;
          if (node.parent.id === parent.id && nodeName === name) {
            return node;
          }
        }

        return FS.lookup(parent, name);
      },
  createNode(parent, name, mode, rdev) {
        var node = new FS.FSNode(parent, name, mode, rdev);

        FS.hashAddNode(node);

        return node;
      },
  destroyNode(node) {
        FS.hashRemoveNode(node);
      },
  isRoot(node) {
        return node === node.parent;
      },
  isMountpoint(node) {
        return !!node.mounted;
      },
  isFile(mode) {
        return (mode & 61440) === 32768;
      },
  isDir(mode) {
        return (mode & 61440) === 16384;
      },
  isLink(mode) {
        return (mode & 61440) === 40960;
      },
  isChrdev(mode) {
        return (mode & 61440) === 8192;
      },
  isBlkdev(mode) {
        return (mode & 61440) === 24576;
      },
  isFIFO(mode) {
        return (mode & 61440) === 4096;
      },
  isSocket(mode) {
        return (mode & 49152) === 49152;
      },
  flagsToPermissionString(flag) {
        var perms = ['r', 'w', 'rw'][flag & 3];
        if ((flag & 512)) {
          perms += 'w';
        }
        return perms;
      },
  nodePermissions(node, perms) {
        if (FS.ignorePermissions) {
          return 0;
        }

        if (perms.includes('r') && !(node.mode & 292)) {
          return 2;
        } else if (perms.includes('w') && !(node.mode & 146)) {
          return 2;
        } else if (perms.includes('x') && !(node.mode & 73)) {
          return 2;
        }
        return 0;
      },
  mayLookup(dir) {
        var errCode = FS.nodePermissions(dir, 'x');
        if (errCode) return errCode;
        if (!dir.node_ops.lookup) return 2;
        return 0;
      },
  mayCreate(dir, name) {
        try {
          var node = FS.lookupNode(dir, name);
          return 20;
        } catch (e) {
        }
        return FS.nodePermissions(dir, 'wx');
      },
  mayDelete(dir, name, isdir) {
        var node;
        try {
          node = FS.lookupNode(dir, name);
        } catch (e) {
          return e.errno;
        }
        var errCode = FS.nodePermissions(dir, 'wx');
        if (errCode) {
          return errCode;
        }
        if (isdir) {
          if (!FS.isDir(node.mode)) {
            return 54;
          }
          if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
            return 10;
          }
        } else {
          if (FS.isDir(node.mode)) {
            return 31;
          }
        }
        return 0;
      },
  mayOpen(node, flags) {
        if (!node) {
          return 44;
        }
        if (FS.isLink(node.mode)) {
          return 32;
        } else if (FS.isDir(node.mode)) {
          if (FS.flagsToPermissionString(flags) !== 'r' ||
              (flags & 512)) {
            return 31;
          }
        }
        return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
      },
  MAX_OPEN_FDS:4096,
  nextfd() {
        for (var fd = 0; fd <= FS.MAX_OPEN_FDS; fd++) {
          if (!FS.streams[fd]) {
            return fd;
          }
        }
        throw new FS.ErrnoError(33);
      },
  getStreamChecked(fd) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(8);
        }
        return stream;
      },
  getStream:(fd) => FS.streams[fd],
  createStream(stream, fd = -1) {
        if (!FS.FSStream) {
          FS.FSStream =   function() {
            this.shared = { };
          };
          FS.FSStream.prototype = {};
          Object.defineProperties(FS.FSStream.prototype, {
            object: {

              get() { return this.node; },

              set(val) { this.node = val; }
            },
            isRead: {

              get() { return (this.flags & 2097155) !== 1; }
            },
            isWrite: {

              get() { return (this.flags & 2097155) !== 0; }
            },
            isAppend: {

              get() { return (this.flags & 1024); }
            },
            flags: {

              get() { return this.shared.flags; },

              set(val) { this.shared.flags = val; },
            },
            position : {

              get() { return this.shared.position; },

              set(val) { this.shared.position = val; },
            },
          });
        }

        stream = Object.assign(new FS.FSStream(), stream);
        if (fd == -1) {
          fd = FS.nextfd();
        }
        stream.fd = fd;
        FS.streams[fd] = stream;
        return stream;
      },
  closeStream(fd) {
        FS.streams[fd] = null;
      },
  chrdev_stream_ops:{
  open(stream) {
          var device = FS.getDevice(stream.node.rdev);

          stream.stream_ops = device.stream_ops;

          if (stream.stream_ops.open) {
            stream.stream_ops.open(stream);
          }
        },
  llseek() {
          throw new FS.ErrnoError(70);
        },
  },
  major:(dev) => ((dev) >> 8),
  minor:(dev) => ((dev) & 0xff),
  makedev:(ma, mi) => ((ma) << 8 | (mi)),
  registerDevice(dev, ops) {
        FS.devices[dev] = { stream_ops: ops };
      },
  getDevice:(dev) => FS.devices[dev],
  getMounts(mount) {
        var mounts = [];
        var check = [mount];

        while (check.length) {
          var m = check.pop();

          mounts.push(m);

          check.push.apply(check, m.mounts);
        }

        return mounts;
      },
  syncfs(populate, callback) {
        if (typeof populate == 'function') {
          callback = populate;
          populate = false;
        }

        FS.syncFSRequests++;

        if (FS.syncFSRequests > 1) {
          err(`warning: ${FS.syncFSRequests} FS.syncfs operations in flight at once, probably just doing extra work`);
        }

        var mounts = FS.getMounts(FS.root.mount);
        var completed = 0;

        function doCallback(errCode) {
          FS.syncFSRequests--;
          return callback(errCode);
        }

        function done(errCode) {
          if (errCode) {
            if (!done.errored) {
              done.errored = true;
              return doCallback(errCode);
            }
            return;
          }
          if (++completed >= mounts.length) {
            doCallback(null);
          }
        };

        mounts.forEach((mount) => {
          if (!mount.type.syncfs) {
            return done(null);
          }
          mount.type.syncfs(mount, populate, done);
        });
      },
  mount(type, opts, mountpoint) {
        var root = mountpoint === '/';
        var pseudo = !mountpoint;
        var node;

        if (root && FS.root) {
          throw new FS.ErrnoError(10);
        } else if (!root && !pseudo) {
          var lookup = FS.lookupPath(mountpoint, { follow_mount: false });

          mountpoint = lookup.path;
          node = lookup.node;

          if (FS.isMountpoint(node)) {
            throw new FS.ErrnoError(10);
          }

          if (!FS.isDir(node.mode)) {
            throw new FS.ErrnoError(54);
          }
        }

        var mount = {
          type,
          opts,
          mountpoint,
          mounts: []
        };

        var mountRoot = type.mount(mount);
        mountRoot.mount = mount;
        mount.root = mountRoot;

        if (root) {
          FS.root = mountRoot;
        } else if (node) {

          node.mounted = mount;

          if (node.mount) {
            node.mount.mounts.push(mount);
          }
        }

        return mountRoot;
      },
  unmount(mountpoint) {
        var lookup = FS.lookupPath(mountpoint, { follow_mount: false });

        if (!FS.isMountpoint(lookup.node)) {
          throw new FS.ErrnoError(28);
        }

        var node = lookup.node;
        var mount = node.mounted;
        var mounts = FS.getMounts(mount);

        Object.keys(FS.nameTable).forEach((hash) => {
          var current = FS.nameTable[hash];

          while (current) {
            var next = current.name_next;

            if (mounts.includes(current.mount)) {
              FS.destroyNode(current);
            }

            current = next;
          }
        });

        node.mounted = null;

        var idx = node.mount.mounts.indexOf(mount);
        node.mount.mounts.splice(idx, 1);
      },
  lookup(parent, name) {
        return parent.node_ops.lookup(parent, name);
      },
  mknod(path, mode, dev) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        if (!name || name === '.' || name === '..') {
          throw new FS.ErrnoError(28);
        }
        var errCode = FS.mayCreate(parent, name);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        if (!parent.node_ops.mknod) {
          throw new FS.ErrnoError(63);
        }
        return parent.node_ops.mknod(parent, name, mode, dev);
      },
  create(path, mode) {
        mode = mode !== undefined ? mode : 438  ;
        mode &= 4095;
        mode |= 32768;
        return FS.mknod(path, mode, 0);
      },
  mkdir(path, mode) {
        mode = mode !== undefined ? mode : 511  ;
        mode &= 511 | 512;
        mode |= 16384;
        return FS.mknod(path, mode, 0);
      },
  mkdirTree(path, mode) {
        var dirs = path.split('/');
        var d = '';
        for (var i = 0; i < dirs.length; ++i) {
          if (!dirs[i]) continue;
          d += '/' + dirs[i];
          try {
            FS.mkdir(d, mode);
          } catch(e) {
            if (e.errno != 20) throw e;
          }
        }
      },
  mkdev(path, mode, dev) {
        if (typeof dev == 'undefined') {
          dev = mode;
          mode = 438  ;
        }
        mode |= 8192;
        return FS.mknod(path, mode, dev);
      },
  symlink(oldpath, newpath) {
        if (!PATH_FS.resolve(oldpath)) {
          throw new FS.ErrnoError(44);
        }
        var lookup = FS.lookupPath(newpath, { parent: true });
        var parent = lookup.node;
        if (!parent) {
          throw new FS.ErrnoError(44);
        }
        var newname = PATH.basename(newpath);
        var errCode = FS.mayCreate(parent, newname);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        if (!parent.node_ops.symlink) {
          throw new FS.ErrnoError(63);
        }
        return parent.node_ops.symlink(parent, newname, oldpath);
      },
  rename(old_path, new_path) {
        var old_dirname = PATH.dirname(old_path);
        var new_dirname = PATH.dirname(new_path);
        var old_name = PATH.basename(old_path);
        var new_name = PATH.basename(new_path);

        var lookup, old_dir, new_dir;

        lookup = FS.lookupPath(old_path, { parent: true });
        old_dir = lookup.node;
        lookup = FS.lookupPath(new_path, { parent: true });
        new_dir = lookup.node;

        if (!old_dir || !new_dir) throw new FS.ErrnoError(44);

        if (old_dir.mount !== new_dir.mount) {
          throw new FS.ErrnoError(75);
        }

        var old_node = FS.lookupNode(old_dir, old_name);

        var relative = PATH_FS.relative(old_path, new_dirname);
        if (relative.charAt(0) !== '.') {
          throw new FS.ErrnoError(28);
        }

        relative = PATH_FS.relative(new_path, old_dirname);
        if (relative.charAt(0) !== '.') {
          throw new FS.ErrnoError(55);
        }

        var new_node;
        try {
          new_node = FS.lookupNode(new_dir, new_name);
        } catch (e) {

        }

        if (old_node === new_node) {
          return;
        }

        var isdir = FS.isDir(old_node.mode);
        var errCode = FS.mayDelete(old_dir, old_name, isdir);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }

        errCode = new_node ?
          FS.mayDelete(new_dir, new_name, isdir) :
          FS.mayCreate(new_dir, new_name);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        if (!old_dir.node_ops.rename) {
          throw new FS.ErrnoError(63);
        }
        if (FS.isMountpoint(old_node) || (new_node && FS.isMountpoint(new_node))) {
          throw new FS.ErrnoError(10);
        }

        if (new_dir !== old_dir) {
          errCode = FS.nodePermissions(old_dir, 'w');
          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
        }

        FS.hashRemoveNode(old_node);

        try {
          old_dir.node_ops.rename(old_node, new_dir, new_name);
        } catch (e) {
          throw e;
        } finally {

          FS.hashAddNode(old_node);
        }
      },
  rmdir(path) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var errCode = FS.mayDelete(parent, name, true);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        if (!parent.node_ops.rmdir) {
          throw new FS.ErrnoError(63);
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(10);
        }
        parent.node_ops.rmdir(parent, name);
        FS.destroyNode(node);
      },
  readdir(path) {
        var lookup = FS.lookupPath(path, { follow: true });
        var node = lookup.node;
        if (!node.node_ops.readdir) {
          throw new FS.ErrnoError(54);
        }
        return node.node_ops.readdir(node);
      },
  unlink(path) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        if (!parent) {
          throw new FS.ErrnoError(44);
        }
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var errCode = FS.mayDelete(parent, name, false);
        if (errCode) {

          throw new FS.ErrnoError(errCode);
        }
        if (!parent.node_ops.unlink) {
          throw new FS.ErrnoError(63);
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(10);
        }
        parent.node_ops.unlink(parent, name);
        FS.destroyNode(node);
      },
  readlink(path) {
        var lookup = FS.lookupPath(path);
        var link = lookup.node;
        if (!link) {
          throw new FS.ErrnoError(44);
        }
        if (!link.node_ops.readlink) {
          throw new FS.ErrnoError(28);
        }
        return PATH_FS.resolve(FS.getPath(link.parent), link.node_ops.readlink(link));
      },
  stat(path, dontFollow) {
        var lookup = FS.lookupPath(path, { follow: !dontFollow });
        var node = lookup.node;
        if (!node) {
          throw new FS.ErrnoError(44);
        }
        if (!node.node_ops.getattr) {
          throw new FS.ErrnoError(63);
        }
        return node.node_ops.getattr(node);
      },
  lstat(path) {
        return FS.stat(path, true);
      },
  chmod(path, mode, dontFollow) {
        var node;
        if (typeof path == 'string') {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(63);
        }
        node.node_ops.setattr(node, {
          mode: (mode & 4095) | (node.mode & ~4095),
          timestamp: Date.now()
        });
      },
  lchmod(path, mode) {
        FS.chmod(path, mode, true);
      },
  fchmod(fd, mode) {
        var stream = FS.getStreamChecked(fd);
        FS.chmod(stream.node, mode);
      },
  chown(path, uid, gid, dontFollow) {
        var node;
        if (typeof path == 'string') {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(63);
        }
        node.node_ops.setattr(node, {
          timestamp: Date.now()

        });
      },
  lchown(path, uid, gid) {
        FS.chown(path, uid, gid, true);
      },
  fchown(fd, uid, gid) {
        var stream = FS.getStreamChecked(fd);
        FS.chown(stream.node, uid, gid);
      },
  truncate(path, len) {
        if (len < 0) {
          throw new FS.ErrnoError(28);
        }
        var node;
        if (typeof path == 'string') {
          var lookup = FS.lookupPath(path, { follow: true });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(63);
        }
        if (FS.isDir(node.mode)) {
          throw new FS.ErrnoError(31);
        }
        if (!FS.isFile(node.mode)) {
          throw new FS.ErrnoError(28);
        }
        var errCode = FS.nodePermissions(node, 'w');
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        node.node_ops.setattr(node, {
          size: len,
          timestamp: Date.now()
        });
      },
  ftruncate(fd, len) {
        var stream = FS.getStreamChecked(fd);
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(28);
        }
        FS.truncate(stream.node, len);
      },
  utime(path, atime, mtime) {
        var lookup = FS.lookupPath(path, { follow: true });
        var node = lookup.node;
        node.node_ops.setattr(node, {
          timestamp: Math.max(atime, mtime)
        });
      },
  open(path, flags, mode) {
        if (path === "") {
          throw new FS.ErrnoError(44);
        }
        flags = typeof flags == 'string' ? FS_modeStringToFlags(flags) : flags;
        mode = typeof mode == 'undefined' ? 438   : mode;
        if ((flags & 64)) {
          mode = (mode & 4095) | 32768;
        } else {
          mode = 0;
        }
        var node;
        if (typeof path == 'object') {
          node = path;
        } else {
          path = PATH.normalize(path);
          try {
            var lookup = FS.lookupPath(path, {
              follow: !(flags & 131072)
            });
            node = lookup.node;
          } catch (e) {

          }
        }

        var created = false;
        if ((flags & 64)) {
          if (node) {

            if ((flags & 128)) {
              throw new FS.ErrnoError(20);
            }
          } else {

            node = FS.mknod(path, mode, 0);
            created = true;
          }
        }
        if (!node) {
          throw new FS.ErrnoError(44);
        }

        if (FS.isChrdev(node.mode)) {
          flags &= ~512;
        }

        if ((flags & 65536) && !FS.isDir(node.mode)) {
          throw new FS.ErrnoError(54);
        }

        if (!created) {
          var errCode = FS.mayOpen(node, flags);
          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
        }

        if ((flags & 512) && !created) {
          FS.truncate(node, 0);
        }

        flags &= ~(128 | 512 | 131072);

        var stream = FS.createStream({
          node,
          path: FS.getPath(node),
          flags,
          seekable: true,
          position: 0,
          stream_ops: node.stream_ops,

          ungotten: [],
          error: false
        });

        if (stream.stream_ops.open) {
          stream.stream_ops.open(stream);
        }
        if (Module['logReadFiles'] && !(flags & 1)) {
          if (!FS.readFiles) FS.readFiles = {};
          if (!(path in FS.readFiles)) {
            FS.readFiles[path] = 1;
          }
        }
        return stream;
      },
  close(stream) {
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if (stream.getdents) stream.getdents = null;
        try {
          if (stream.stream_ops.close) {
            stream.stream_ops.close(stream);
          }
        } catch (e) {
          throw e;
        } finally {
          FS.closeStream(stream.fd);
        }
        stream.fd = null;
      },
  isClosed(stream) {
        return stream.fd === null;
      },
  llseek(stream, offset, whence) {
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if (!stream.seekable || !stream.stream_ops.llseek) {
          throw new FS.ErrnoError(70);
        }
        if (whence != 0 && whence != 1 && whence != 2) {
          throw new FS.ErrnoError(28);
        }
        stream.position = stream.stream_ops.llseek(stream, offset, whence);
        stream.ungotten = [];
        return stream.position;
      },
  read(stream, buffer, offset, length, position) {
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(28);
        }
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if ((stream.flags & 2097155) === 1) {
          throw new FS.ErrnoError(8);
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(31);
        }
        if (!stream.stream_ops.read) {
          throw new FS.ErrnoError(28);
        }
        var seeking = typeof position != 'undefined';
        if (!seeking) {
          position = stream.position;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(70);
        }
        var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
        if (!seeking) stream.position += bytesRead;
        return bytesRead;
      },
  write(stream, buffer, offset, length, position, canOwn) {
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(28);
        }
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(8);
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(31);
        }
        if (!stream.stream_ops.write) {
          throw new FS.ErrnoError(28);
        }
        if (stream.seekable && stream.flags & 1024) {

          FS.llseek(stream, 0, 2);
        }
        var seeking = typeof position != 'undefined';
        if (!seeking) {
          position = stream.position;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(70);
        }
        var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
        if (!seeking) stream.position += bytesWritten;
        return bytesWritten;
      },
  allocate(stream, offset, length) {
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if (offset < 0 || length <= 0) {
          throw new FS.ErrnoError(28);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(8);
        }
        if (!FS.isFile(stream.node.mode) && !FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(43);
        }
        if (!stream.stream_ops.allocate) {
          throw new FS.ErrnoError(138);
        }
        stream.stream_ops.allocate(stream, offset, length);
      },
  mmap(stream, length, position, prot, flags) {

        if ((prot & 2) !== 0
            && (flags & 2) === 0
            && (stream.flags & 2097155) !== 2) {
          throw new FS.ErrnoError(2);
        }
        if ((stream.flags & 2097155) === 1) {
          throw new FS.ErrnoError(2);
        }
        if (!stream.stream_ops.mmap) {
          throw new FS.ErrnoError(43);
        }
        return stream.stream_ops.mmap(stream, length, position, prot, flags);
      },
  msync(stream, buffer, offset, length, mmapFlags) {
        if (!stream.stream_ops.msync) {
          return 0;
        }
        return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags);
      },
  munmap:(stream) => 0,
  ioctl(stream, cmd, arg) {
        if (!stream.stream_ops.ioctl) {
          throw new FS.ErrnoError(59);
        }
        return stream.stream_ops.ioctl(stream, cmd, arg);
      },
  readFile(path, opts = {}) {
        opts.flags = opts.flags || 0;
        opts.encoding = opts.encoding || 'binary';
        if (opts.encoding !== 'utf8' && opts.encoding !== 'binary') {
          throw new Error(`Invalid encoding type "${opts.encoding}"`);
        }
        var ret;
        var stream = FS.open(path, opts.flags);
        var stat = FS.stat(path);
        var length = stat.size;
        var buf = new Uint8Array(length);
        FS.read(stream, buf, 0, length, 0);
        if (opts.encoding === 'utf8') {
          ret = UTF8ArrayToString(buf, 0);
        } else if (opts.encoding === 'binary') {
          ret = buf;
        }
        FS.close(stream);
        return ret;
      },
  writeFile(path, data, opts = {}) {
        opts.flags = opts.flags || 577;
        var stream = FS.open(path, opts.flags, opts.mode);
        if (typeof data == 'string') {
          var buf = new Uint8Array(lengthBytesUTF8(data)+1);
          var actualNumBytes = stringToUTF8Array(data, buf, 0, buf.length);
          FS.write(stream, buf, 0, actualNumBytes, undefined, opts.canOwn);
        } else if (ArrayBuffer.isView(data)) {
          FS.write(stream, data, 0, data.byteLength, undefined, opts.canOwn);
        } else {
          throw new Error('Unsupported data type');
        }
        FS.close(stream);
      },
  cwd:() => FS.currentPath,
  chdir(path) {
        var lookup = FS.lookupPath(path, { follow: true });
        if (lookup.node === null) {
          throw new FS.ErrnoError(44);
        }
        if (!FS.isDir(lookup.node.mode)) {
          throw new FS.ErrnoError(54);
        }
        var errCode = FS.nodePermissions(lookup.node, 'x');
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        FS.currentPath = lookup.path;
      },
  createDefaultDirectories() {
        FS.mkdir('/tmp');
        FS.mkdir('/home');
        FS.mkdir('/home/web_user');
      },
  createDefaultDevices() {

        FS.mkdir('/dev');

        FS.registerDevice(FS.makedev(1, 3), {
          read: () => 0,
          write: (stream, buffer, offset, length, pos) => length,
        });
        FS.mkdev('/dev/null', FS.makedev(1, 3));

        TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
        TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
        FS.mkdev('/dev/tty', FS.makedev(5, 0));
        FS.mkdev('/dev/tty1', FS.makedev(6, 0));

        var randomBuffer = new Uint8Array(1024), randomLeft = 0;
        var randomByte = () => {
          if (randomLeft === 0) {
            randomLeft = randomFill(randomBuffer).byteLength;
          }
          return randomBuffer[--randomLeft];
        };
        FS.createDevice('/dev', 'random', randomByte);
        FS.createDevice('/dev', 'urandom', randomByte);

        FS.mkdir('/dev/shm');
        FS.mkdir('/dev/shm/tmp');
      },
  createSpecialDirectories() {

        FS.mkdir('/proc');
        var proc_self = FS.mkdir('/proc/self');
        FS.mkdir('/proc/self/fd');
        FS.mount({
          mount() {
            var node = FS.createNode(proc_self, 'fd', 16384 | 511  , 73);
            node.node_ops = {
              lookup(parent, name) {
                var fd = +name;
                var stream = FS.getStreamChecked(fd);
                var ret = {
                  parent: null,
                  mount: { mountpoint: 'fake' },
                  node_ops: { readlink: () => stream.path },
                };
                ret.parent = ret;
                return ret;
              }
            };
            return node;
          }
        }, {}, '/proc/self/fd');
      },
  createStandardStreams() {

        if (Module['stdin']) {
          FS.createDevice('/dev', 'stdin', Module['stdin']);
        } else {
          FS.symlink('/dev/tty', '/dev/stdin');
        }
        if (Module['stdout']) {
          FS.createDevice('/dev', 'stdout', null, Module['stdout']);
        } else {
          FS.symlink('/dev/tty', '/dev/stdout');
        }
        if (Module['stderr']) {
          FS.createDevice('/dev', 'stderr', null, Module['stderr']);
        } else {
          FS.symlink('/dev/tty1', '/dev/stderr');
        }

        var stdin = FS.open('/dev/stdin', 0);
        var stdout = FS.open('/dev/stdout', 1);
        var stderr = FS.open('/dev/stderr', 1);
      },
  ensureErrnoError() {
        if (FS.ErrnoError) return;
        FS.ErrnoError =   function ErrnoError(errno, node) {

          this.name = 'ErrnoError';
          this.node = node;
          this.setErrno =   function(errno) {
            this.errno = errno;
          };
          this.setErrno(errno);
          this.message = 'FS error';

        };
        FS.ErrnoError.prototype = new Error();
        FS.ErrnoError.prototype.constructor = FS.ErrnoError;

        [44].forEach((code) => {
          FS.genericErrors[code] = new FS.ErrnoError(code);
          FS.genericErrors[code].stack = '<generic error, no stack>';
        });
      },
  staticInit() {
        FS.ensureErrnoError();

        FS.nameTable = new Array(4096);

        FS.mount(MEMFS, {}, '/');

        FS.createDefaultDirectories();
        FS.createDefaultDevices();
        FS.createSpecialDirectories();

        FS.filesystems = {
          'MEMFS': MEMFS,
        };
      },
  init(input, output, error) {
        FS.init.initialized = true;

        FS.ensureErrnoError();

        Module['stdin'] = input || Module['stdin'];
        Module['stdout'] = output || Module['stdout'];
        Module['stderr'] = error || Module['stderr'];

        FS.createStandardStreams();
      },
  quit() {
        FS.init.initialized = false;

        for (var i = 0; i < FS.streams.length; i++) {
          var stream = FS.streams[i];
          if (!stream) {
            continue;
          }
          FS.close(stream);
        }
      },
  findObject(path, dontResolveLastLink) {
        var ret = FS.analyzePath(path, dontResolveLastLink);
        if (!ret.exists) {
          return null;
        }
        return ret.object;
      },
  analyzePath(path, dontResolveLastLink) {

        try {
          var lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
          path = lookup.path;
        } catch (e) {
        }
        var ret = {
          isRoot: false, exists: false, error: 0, name: null, path: null, object: null,
          parentExists: false, parentPath: null, parentObject: null
        };
        try {
          var lookup = FS.lookupPath(path, { parent: true });
          ret.parentExists = true;
          ret.parentPath = lookup.path;
          ret.parentObject = lookup.node;
          ret.name = PATH.basename(path);
          lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
          ret.exists = true;
          ret.path = lookup.path;
          ret.object = lookup.node;
          ret.name = lookup.node.name;
          ret.isRoot = lookup.path === '/';
        } catch (e) {
          ret.error = e.errno;
        };
        return ret;
      },
  createPath(parent, path, canRead, canWrite) {
        parent = typeof parent == 'string' ? parent : FS.getPath(parent);
        var parts = path.split('/').reverse();
        while (parts.length) {
          var part = parts.pop();
          if (!part) continue;
          var current = PATH.join2(parent, part);
          try {
            FS.mkdir(current);
          } catch (e) {

          }
          parent = current;
        }
        return current;
      },
  createFile(parent, name, properties, canRead, canWrite) {
        var path = PATH.join2(typeof parent == 'string' ? parent : FS.getPath(parent), name);
        var mode = FS_getMode(canRead, canWrite);
        return FS.create(path, mode);
      },
  createDataFile(parent, name, data, canRead, canWrite, canOwn) {
        var path = name;
        if (parent) {
          parent = typeof parent == 'string' ? parent : FS.getPath(parent);
          path = name ? PATH.join2(parent, name) : parent;
        }
        var mode = FS_getMode(canRead, canWrite);
        var node = FS.create(path, mode);
        if (data) {
          if (typeof data == 'string') {
            var arr = new Array(data.length);
            for (var i = 0, len = data.length; i < len; ++i) arr[i] = data.charCodeAt(i);
            data = arr;
          }

          FS.chmod(node, mode | 146);
          var stream = FS.open(node, 577);
          FS.write(stream, data, 0, data.length, 0, canOwn);
          FS.close(stream);
          FS.chmod(node, mode);
        }
      },
  createDevice(parent, name, input, output) {
        var path = PATH.join2(typeof parent == 'string' ? parent : FS.getPath(parent), name);
        var mode = FS_getMode(!!input, !!output);
        if (!FS.createDevice.major) FS.createDevice.major = 64;
        var dev = FS.makedev(FS.createDevice.major++, 0);

        FS.registerDevice(dev, {
          open(stream) {
            stream.seekable = false;
          },
          close(stream) {

            if (output && output.buffer && output.buffer.length) {
              output(10);
            }
          },
          read(stream, buffer, offset, length, pos  ) {
            var bytesRead = 0;
            for (var i = 0; i < length; i++) {
              var result;
              try {
                result = input();
              } catch (e) {
                throw new FS.ErrnoError(29);
              }
              if (result === undefined && bytesRead === 0) {
                throw new FS.ErrnoError(6);
              }
              if (result === null || result === undefined) break;
              bytesRead++;
              buffer[offset+i] = result;
            }
            if (bytesRead) {
              stream.node.timestamp = Date.now();
            }
            return bytesRead;
          },
          write(stream, buffer, offset, length, pos) {
            for (var i = 0; i < length; i++) {
              try {
                output(buffer[offset+i]);
              } catch (e) {
                throw new FS.ErrnoError(29);
              }
            }
            if (length) {
              stream.node.timestamp = Date.now();
            }
            return i;
          }
        });
        return FS.mkdev(path, mode, dev);
      },
  forceLoadFile(obj) {
        if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
        if (typeof XMLHttpRequest != 'undefined') {
          throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
        } else if (read_) {

          try {

            obj.contents = intArrayFromString(read_(obj.url), true);
            obj.usedBytes = obj.contents.length;
          } catch (e) {
            throw new FS.ErrnoError(29);
          }
        } else {
          throw new Error('Cannot load without read() or XMLHttpRequest.');
        }
      },
  createLazyFile(parent, name, url, canRead, canWrite) {

        function LazyUint8Array() {
          this.lengthKnown = false;
          this.chunks = [];
        }
        LazyUint8Array.prototype.get =   function LazyUint8Array_get(idx) {
          if (idx > this.length-1 || idx < 0) {
            return undefined;
          }
          var chunkOffset = idx % this.chunkSize;
          var chunkNum = (idx / this.chunkSize)|0;
          return this.getter(chunkNum)[chunkOffset];
        };
        LazyUint8Array.prototype.setDataGetter = function LazyUint8Array_setDataGetter(getter) {
          this.getter = getter;
        };
        LazyUint8Array.prototype.cacheLength = function LazyUint8Array_cacheLength() {

          var xhr = new XMLHttpRequest();
          xhr.open('HEAD', url, false);
          xhr.send(null);
          if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
          var datalength = Number(xhr.getResponseHeader("Content-length"));
          var header;
          var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
          var usesGzip = (header = xhr.getResponseHeader("Content-Encoding")) && header === "gzip";

          var chunkSize = 1024*1024;

          if (!hasByteServing) chunkSize = datalength;

          var doXHR = (from, to) => {
            if (from > to) throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
            if (to > datalength-1) throw new Error("only " + datalength + " bytes available! programmer error!");

            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, false);
            if (datalength !== chunkSize) xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);

            xhr.responseType = 'arraybuffer';
            if (xhr.overrideMimeType) {
              xhr.overrideMimeType('text/plain; charset=x-user-defined');
            }

            xhr.send(null);
            if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
            if (xhr.response !== undefined) {
              return new Uint8Array( (xhr.response || []));
            }
            return intArrayFromString(xhr.responseText || '', true);
          };
          var lazyArray = this;
          lazyArray.setDataGetter((chunkNum) => {
            var start = chunkNum * chunkSize;
            var end = (chunkNum+1) * chunkSize - 1;
            end = Math.min(end, datalength-1);
            if (typeof lazyArray.chunks[chunkNum] == 'undefined') {
              lazyArray.chunks[chunkNum] = doXHR(start, end);
            }
            if (typeof lazyArray.chunks[chunkNum] == 'undefined') throw new Error('doXHR failed!');
            return lazyArray.chunks[chunkNum];
          });

          if (usesGzip || !datalength) {

            chunkSize = datalength = 1;
            datalength = this.getter(0).length;
            chunkSize = datalength;
            out("LazyFiles on gzip forces download of the whole file when length is accessed");
          }

          this._length = datalength;
          this._chunkSize = chunkSize;
          this.lengthKnown = true;
        };
        if (typeof XMLHttpRequest != 'undefined') {
          if (!ENVIRONMENT_IS_WORKER) throw 'Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc';
          var lazyArray = new LazyUint8Array();
          Object.defineProperties(lazyArray, {
            length: {
              get:   function() {
                if (!this.lengthKnown) {
                  this.cacheLength();
                }
                return this._length;
              }
            },
            chunkSize: {
              get:   function() {
                if (!this.lengthKnown) {
                  this.cacheLength();
                }
                return this._chunkSize;
              }
            }
          });

          var properties = { isDevice: false, contents: lazyArray };
        } else {
          var properties = { isDevice: false, url: url };
        }

        var node = FS.createFile(parent, name, properties, canRead, canWrite);

        if (properties.contents) {
          node.contents = properties.contents;
        } else if (properties.url) {
          node.contents = null;
          node.url = properties.url;
        }

        Object.defineProperties(node, {
          usedBytes: {
            get:   function() { return this.contents.length; }
          }
        });

        var stream_ops = {};
        var keys = Object.keys(node.stream_ops);
        keys.forEach((key) => {
          var fn = node.stream_ops[key];
          stream_ops[key] = function forceLoadLazyFile() {
            FS.forceLoadFile(node);
            return fn.apply(null, arguments);
          };
        });
        function writeChunks(stream, buffer, offset, length, position) {
          var contents = stream.node.contents;
          if (position >= contents.length)
            return 0;
          var size = Math.min(contents.length - position, length);
          if (contents.slice) {
            for (var i = 0; i < size; i++) {
              buffer[offset + i] = contents[position + i];
            }
          } else {
            for (var i = 0; i < size; i++) {
              buffer[offset + i] = contents.get(position + i);
            }
          }
          return size;
        }

        stream_ops.read = (stream, buffer, offset, length, position) => {
          FS.forceLoadFile(node);
          return writeChunks(stream, buffer, offset, length, position)
        };

        stream_ops.mmap = (stream, length, position, prot, flags) => {
          FS.forceLoadFile(node);
          var ptr = mmapAlloc(length);
          if (!ptr) {
            throw new FS.ErrnoError(48);
          }
          writeChunks(stream, HEAP8, ptr, length, position);
          return { ptr, allocated: true };
        };
        node.stream_ops = stream_ops;
        return node;
      },
  };

  var UTF8ToString = (ptr, maxBytesToRead) => {
      return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : '';
    };
  var SYSCALLS = {
  DEFAULT_POLLMASK:5,
  calculateAt(dirfd, path, allowEmpty) {
        if (PATH.isAbs(path)) {
          return path;
        }

        var dir;
        if (dirfd === -100) {
          dir = FS.cwd();
        } else {
          var dirstream = SYSCALLS.getStreamFromFD(dirfd);
          dir = dirstream.path;
        }
        if (path.length == 0) {
          if (!allowEmpty) {
            throw new FS.ErrnoError(44);;
          }
          return dir;
        }
        return PATH.join2(dir, path);
      },
  doStat(func, path, buf) {
        try {
          var stat = func(path);
        } catch (e) {
          if (e && e.node && PATH.normalize(path) !== PATH.normalize(FS.getPath(e.node))) {

            return -54;
          }
          throw e;
        }
        HEAP32[((buf)>>2)] = stat.dev;
        HEAP32[(((buf)+(4))>>2)] = stat.mode;
        HEAPU32[(((buf)+(8))>>2)] = stat.nlink;
        HEAP32[(((buf)+(12))>>2)] = stat.uid;
        HEAP32[(((buf)+(16))>>2)] = stat.gid;
        HEAP32[(((buf)+(20))>>2)] = stat.rdev;
        (tempI64 = [stat.size>>>0,(tempDouble = stat.size,(+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? (+(Math.floor((tempDouble)/4294967296.0)))>>>0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)], HEAP32[(((buf)+(24))>>2)] = tempI64[0],HEAP32[(((buf)+(28))>>2)] = tempI64[1]);
        HEAP32[(((buf)+(32))>>2)] = 4096;
        HEAP32[(((buf)+(36))>>2)] = stat.blocks;
        var atime = stat.atime.getTime();
        var mtime = stat.mtime.getTime();
        var ctime = stat.ctime.getTime();
        (tempI64 = [Math.floor(atime / 1000)>>>0,(tempDouble = Math.floor(atime / 1000),(+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? (+(Math.floor((tempDouble)/4294967296.0)))>>>0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)], HEAP32[(((buf)+(40))>>2)] = tempI64[0],HEAP32[(((buf)+(44))>>2)] = tempI64[1]);
        HEAPU32[(((buf)+(48))>>2)] = (atime % 1000) * 1000;
        (tempI64 = [Math.floor(mtime / 1000)>>>0,(tempDouble = Math.floor(mtime / 1000),(+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? (+(Math.floor((tempDouble)/4294967296.0)))>>>0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)], HEAP32[(((buf)+(56))>>2)] = tempI64[0],HEAP32[(((buf)+(60))>>2)] = tempI64[1]);
        HEAPU32[(((buf)+(64))>>2)] = (mtime % 1000) * 1000;
        (tempI64 = [Math.floor(ctime / 1000)>>>0,(tempDouble = Math.floor(ctime / 1000),(+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? (+(Math.floor((tempDouble)/4294967296.0)))>>>0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)], HEAP32[(((buf)+(72))>>2)] = tempI64[0],HEAP32[(((buf)+(76))>>2)] = tempI64[1]);
        HEAPU32[(((buf)+(80))>>2)] = (ctime % 1000) * 1000;
        (tempI64 = [stat.ino>>>0,(tempDouble = stat.ino,(+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? (+(Math.floor((tempDouble)/4294967296.0)))>>>0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)], HEAP32[(((buf)+(88))>>2)] = tempI64[0],HEAP32[(((buf)+(92))>>2)] = tempI64[1]);
        return 0;
      },
  doMsync(addr, stream, len, flags, offset) {
        if (!FS.isFile(stream.node.mode)) {
          throw new FS.ErrnoError(43);
        }
        if (flags & 2) {

          return 0;
        }
        var buffer = HEAPU8.slice(addr, addr + len);
        FS.msync(stream, buffer, offset, len, flags);
      },
  varargs:undefined,
  get() {

        var ret = HEAP32[((+SYSCALLS.varargs)>>2)];
        SYSCALLS.varargs += 4;
        return ret;
      },
  getp() { return SYSCALLS.get() },
  getStr(ptr) {
        var ret = UTF8ToString(ptr);
        return ret;
      },
  getStreamFromFD(fd) {
        var stream = FS.getStreamChecked(fd);
        return stream;
      },
  };
  function ___syscall_fcntl64(fd, cmd, varargs) {
  SYSCALLS.varargs = varargs;
  try {

      var stream = SYSCALLS.getStreamFromFD(fd);
      switch (cmd) {
        case 0: {
          var arg = SYSCALLS.get();
          if (arg < 0) {
            return -28;
          }
          while (FS.streams[arg]) {
            arg++;
          }
          var newStream;
          newStream = FS.createStream(stream, arg);
          return newStream.fd;
        }
        case 1:
        case 2:
          return 0;
        case 3:
          return stream.flags;
        case 4: {
          var arg = SYSCALLS.get();
          stream.flags |= arg;
          return 0;
        }
        case 5: {
          var arg = SYSCALLS.getp();
          var offset = 0;

          HEAP16[(((arg)+(offset))>>1)] = 2;
          return 0;
        }
        case 6:
        case 7:
          return 0;
        case 16:
        case 8:
          return -28;
        case 9:

          setErrNo(28);
          return -1;
        default: {
          return -28;
        }
      }
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return -e.errno;
  }
  }

  function ___syscall_fstat64(fd, buf) {
  try {

      var stream = SYSCALLS.getStreamFromFD(fd);
      return SYSCALLS.doStat(FS.stat, stream.path, buf);
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return -e.errno;
  }
  }

  var stringToUTF8 = (str, outPtr, maxBytesToWrite) => {
      return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
    };

  function ___syscall_getcwd(buf, size) {
  try {

      if (size === 0) return -28;
      var cwd = FS.cwd();
      var cwdLengthInBytes = lengthBytesUTF8(cwd) + 1;
      if (size < cwdLengthInBytes) return -68;
      stringToUTF8(cwd, buf, size);
      return cwdLengthInBytes;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return -e.errno;
  }
  }

  function ___syscall_getdents64(fd, dirp, count) {
  try {

      var stream = SYSCALLS.getStreamFromFD(fd)
      if (!stream.getdents) {
        stream.getdents = FS.readdir(stream.path);
      }

      var struct_size = 280;
      var pos = 0;
      var off = FS.llseek(stream, 0, 1);

      var idx = Math.floor(off / struct_size);

      while (idx < stream.getdents.length && pos + struct_size <= count) {
        var id;
        var type;
        var name = stream.getdents[idx];
        if (name === '.') {
          id = stream.node.id;
          type = 4;
        }
        else if (name === '..') {
          var lookup = FS.lookupPath(stream.path, { parent: true });
          id = lookup.node.id;
          type = 4;
        }
        else {
          var child = FS.lookupNode(stream.node, name);
          id = child.id;
          type = FS.isChrdev(child.mode) ? 2 :
                 FS.isDir(child.mode) ? 4 :
                 FS.isLink(child.mode) ? 10 :
                 8;
        }
        (tempI64 = [id>>>0,(tempDouble = id,(+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? (+(Math.floor((tempDouble)/4294967296.0)))>>>0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)], HEAP32[((dirp + pos)>>2)] = tempI64[0],HEAP32[(((dirp + pos)+(4))>>2)] = tempI64[1]);
        (tempI64 = [(idx + 1) * struct_size>>>0,(tempDouble = (idx + 1) * struct_size,(+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? (+(Math.floor((tempDouble)/4294967296.0)))>>>0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)], HEAP32[(((dirp + pos)+(8))>>2)] = tempI64[0],HEAP32[(((dirp + pos)+(12))>>2)] = tempI64[1]);
        HEAP16[(((dirp + pos)+(16))>>1)] = 280;
        HEAP8[(((dirp + pos)+(18))>>0)] = type;
        stringToUTF8(name, dirp + pos + 19, 256);
        pos += struct_size;
        idx += 1;
      }
      FS.llseek(stream, idx * struct_size, 0);
      return pos;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return -e.errno;
  }
  }

  function ___syscall_ioctl(fd, op, varargs) {
  SYSCALLS.varargs = varargs;
  try {

      var stream = SYSCALLS.getStreamFromFD(fd);
      switch (op) {
        case 21509: {
          if (!stream.tty) return -59;
          return 0;
        }
        case 21505: {
          if (!stream.tty) return -59;
          if (stream.tty.ops.ioctl_tcgets) {
            var termios = stream.tty.ops.ioctl_tcgets(stream);
            var argp = SYSCALLS.getp();
            HEAP32[((argp)>>2)] = termios.c_iflag || 0;
            HEAP32[(((argp)+(4))>>2)] = termios.c_oflag || 0;
            HEAP32[(((argp)+(8))>>2)] = termios.c_cflag || 0;
            HEAP32[(((argp)+(12))>>2)] = termios.c_lflag || 0;
            for (var i = 0; i < 32; i++) {
              HEAP8[(((argp + i)+(17))>>0)] = termios.c_cc[i] || 0;
            }
            return 0;
          }
          return 0;
        }
        case 21510:
        case 21511:
        case 21512: {
          if (!stream.tty) return -59;
          return 0;
        }
        case 21506:
        case 21507:
        case 21508: {
          if (!stream.tty) return -59;
          if (stream.tty.ops.ioctl_tcsets) {
            var argp = SYSCALLS.getp();
            var c_iflag = HEAP32[((argp)>>2)];
            var c_oflag = HEAP32[(((argp)+(4))>>2)];
            var c_cflag = HEAP32[(((argp)+(8))>>2)];
            var c_lflag = HEAP32[(((argp)+(12))>>2)];
            var c_cc = []
            for (var i = 0; i < 32; i++) {
              c_cc.push(HEAP8[(((argp + i)+(17))>>0)]);
            }
            return stream.tty.ops.ioctl_tcsets(stream.tty, op, { c_iflag, c_oflag, c_cflag, c_lflag, c_cc });
          }
          return 0;
        }
        case 21519: {
          if (!stream.tty) return -59;
          var argp = SYSCALLS.getp();
          HEAP32[((argp)>>2)] = 0;
          return 0;
        }
        case 21520: {
          if (!stream.tty) return -59;
          return -28;
        }
        case 21531: {
          var argp = SYSCALLS.getp();
          return FS.ioctl(stream, op, argp);
        }
        case 21523: {

          if (!stream.tty) return -59;
          if (stream.tty.ops.ioctl_tiocgwinsz) {
            var winsize = stream.tty.ops.ioctl_tiocgwinsz(stream.tty);
            var argp = SYSCALLS.getp();
            HEAP16[((argp)>>1)] = winsize[0];
            HEAP16[(((argp)+(2))>>1)] = winsize[1];
          }
          return 0;
        }
        case 21524: {

          if (!stream.tty) return -59;
          return 0;
        }
        case 21515: {
          if (!stream.tty) return -59;
          return 0;
        }
        default: return -28;
      }
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return -e.errno;
  }
  }

  function ___syscall_lstat64(path, buf) {
  try {

      path = SYSCALLS.getStr(path);
      return SYSCALLS.doStat(FS.lstat, path, buf);
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return -e.errno;
  }
  }

  function ___syscall_mkdirat(dirfd, path, mode) {
  try {

      path = SYSCALLS.getStr(path);
      path = SYSCALLS.calculateAt(dirfd, path);

      path = PATH.normalize(path);
      if (path[path.length-1] === '/') path = path.substr(0, path.length-1);
      FS.mkdir(path, mode, 0);
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return -e.errno;
  }
  }

  function ___syscall_newfstatat(dirfd, path, buf, flags) {
  try {

      path = SYSCALLS.getStr(path);
      var nofollow = flags & 256;
      var allowEmpty = flags & 4096;
      flags = flags & (~6400);
      path = SYSCALLS.calculateAt(dirfd, path, allowEmpty);
      return SYSCALLS.doStat(nofollow ? FS.lstat : FS.stat, path, buf);
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return -e.errno;
  }
  }

  function ___syscall_openat(dirfd, path, flags, varargs) {
  SYSCALLS.varargs = varargs;
  try {

      path = SYSCALLS.getStr(path);
      path = SYSCALLS.calculateAt(dirfd, path);
      var mode = varargs ? SYSCALLS.get() : 0;
      return FS.open(path, flags, mode).fd;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return -e.errno;
  }
  }

  function ___syscall_readlinkat(dirfd, path, buf, bufsize) {
  try {

      path = SYSCALLS.getStr(path);
      path = SYSCALLS.calculateAt(dirfd, path);
      if (bufsize <= 0) return -28;
      var ret = FS.readlink(path);

      var len = Math.min(bufsize, lengthBytesUTF8(ret));
      var endChar = HEAP8[buf+len];
      stringToUTF8(ret, buf, bufsize+1);

      HEAP8[buf+len] = endChar;
      return len;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return -e.errno;
  }
  }

  function ___syscall_stat64(path, buf) {
  try {

      path = SYSCALLS.getStr(path);
      return SYSCALLS.doStat(FS.stat, path, buf);
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return -e.errno;
  }
  }

  var nowIsMonotonic = 1;
  var __emscripten_get_now_is_monotonic = () => nowIsMonotonic;

  var __emscripten_throw_longjmp = () => {
      throw Infinity;
    };

  var isLeapYear = (year) => year%4 === 0 && (year%100 !== 0 || year%400 === 0);

  var MONTH_DAYS_LEAP_CUMULATIVE = [0,31,60,91,121,152,182,213,244,274,305,335];

  var MONTH_DAYS_REGULAR_CUMULATIVE = [0,31,59,90,120,151,181,212,243,273,304,334];
  var ydayFromDate = (date) => {
      var leap = isLeapYear(date.getFullYear());
      var monthDaysCumulative = (leap ? MONTH_DAYS_LEAP_CUMULATIVE : MONTH_DAYS_REGULAR_CUMULATIVE);
      var yday = monthDaysCumulative[date.getMonth()] + date.getDate() - 1;

      return yday;
    };

  var convertI32PairToI53Checked = (lo, hi) => {
      return ((hi + 0x200000) >>> 0 < 0x400001 - !!lo) ? (lo >>> 0) + hi * 4294967296 : NaN;
    };
  function __localtime_js(time_low, time_high,tmPtr) {
    var time = convertI32PairToI53Checked(time_low, time_high);;

      var date = new Date(time*1000);
      HEAP32[((tmPtr)>>2)] = date.getSeconds();
      HEAP32[(((tmPtr)+(4))>>2)] = date.getMinutes();
      HEAP32[(((tmPtr)+(8))>>2)] = date.getHours();
      HEAP32[(((tmPtr)+(12))>>2)] = date.getDate();
      HEAP32[(((tmPtr)+(16))>>2)] = date.getMonth();
      HEAP32[(((tmPtr)+(20))>>2)] = date.getFullYear()-1900;
      HEAP32[(((tmPtr)+(24))>>2)] = date.getDay();

      var yday = ydayFromDate(date)|0;
      HEAP32[(((tmPtr)+(28))>>2)] = yday;
      HEAP32[(((tmPtr)+(36))>>2)] = -(date.getTimezoneOffset() * 60);

      var start = new Date(date.getFullYear(), 0, 1);
      var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
      var winterOffset = start.getTimezoneOffset();
      var dst = (summerOffset != winterOffset && date.getTimezoneOffset() == Math.min(winterOffset, summerOffset))|0;
      HEAP32[(((tmPtr)+(32))>>2)] = dst;
    ;
  }

  var stringToNewUTF8 = (str) => {
      var size = lengthBytesUTF8(str) + 1;
      var ret = _malloc(size);
      if (ret) stringToUTF8(str, ret, size);
      return ret;
    };
  var __tzset_js = (timezone, daylight, tzname) => {

      var currentYear = new Date().getFullYear();
      var winter = new Date(currentYear, 0, 1);
      var summer = new Date(currentYear, 6, 1);
      var winterOffset = winter.getTimezoneOffset();
      var summerOffset = summer.getTimezoneOffset();

      var stdTimezoneOffset = Math.max(winterOffset, summerOffset);

      HEAPU32[((timezone)>>2)] = stdTimezoneOffset * 60;

      HEAP32[((daylight)>>2)] = Number(winterOffset != summerOffset);

      function extractZone(date) {
        var match = date.toTimeString().match(/\(([A-Za-z ]+)\)$/);
        return match ? match[1] : "GMT";
      };
      var winterName = extractZone(winter);
      var summerName = extractZone(summer);
      var winterNamePtr = stringToNewUTF8(winterName);
      var summerNamePtr = stringToNewUTF8(summerName);
      if (summerOffset < winterOffset) {

        HEAPU32[((tzname)>>2)] = winterNamePtr;
        HEAPU32[(((tzname)+(4))>>2)] = summerNamePtr;
      } else {
        HEAPU32[((tzname)>>2)] = summerNamePtr;
        HEAPU32[(((tzname)+(4))>>2)] = winterNamePtr;
      }
    };

  var _abort = () => {
      abort('');
    };

  var readEmAsmArgsArray = [];
  var readEmAsmArgs = (sigPtr, buf) => {
      readEmAsmArgsArray.length = 0;
      var ch;

      while (ch = HEAPU8[sigPtr++]) {

        var wide = (ch != 105);
        wide &= (ch != 112);
        buf += wide && (buf % 8) ? 4 : 0;
        readEmAsmArgsArray.push(

          ch == 112 ? HEAPU32[((buf)>>2)] :
          ch == 105 ?
            HEAP32[((buf)>>2)] :
            HEAPF64[((buf)>>3)]
        );
        buf += wide ? 8 : 4;
      }
      return readEmAsmArgsArray;
    };
  var runEmAsmFunction = (code, sigPtr, argbuf) => {
      var args = readEmAsmArgs(sigPtr, argbuf);
      return ASM_CONSTS[code].apply(null, args);
    };
  var _emscripten_asm_const_int = (code, sigPtr, argbuf) => {
      return runEmAsmFunction(code, sigPtr, argbuf);
    };

  var handleException = (e) => {

      if (e instanceof ExitStatus || e == 'unwind') {
        return EXITSTATUS;
      }
      quit_(1, e);
    };

  var runtimeKeepaliveCounter = 0;
  var keepRuntimeAlive = () => noExitRuntime || runtimeKeepaliveCounter > 0;

  var _proc_exit = (code) => {
      EXITSTATUS = code;
      if (!keepRuntimeAlive()) {
        if (Module['onExit']) Module['onExit'](code);
        ABORT = true;
      }
      quit_(code, new ExitStatus(code));
    };

  var exitJS = (status, implicit) => {
      EXITSTATUS = status;

      _proc_exit(status);
    };
  var _exit = exitJS;

  var maybeExit = () => {
      if (!keepRuntimeAlive()) {
        try {
          _exit(EXITSTATUS);
        } catch (e) {
          handleException(e);
        }
      }
    };
  var callUserCallback = (func) => {
      if (ABORT) {
        return;
      }
      try {
        func();
        maybeExit();
      } catch (e) {
        handleException(e);
      }
    };

  var safeSetTimeout = (func, timeout) => {

      return setTimeout(() => {

        callUserCallback(func);
      }, timeout);
    };

  var _emscripten_set_main_loop_timing = (mode, value) => {
      Browser.mainLoop.timingMode = mode;
      Browser.mainLoop.timingValue = value;

      if (!Browser.mainLoop.func) {
        return 1;
      }

      if (!Browser.mainLoop.running) {

        Browser.mainLoop.running = true;
      }
      if (mode == 0) {
        Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_setTimeout() {
          var timeUntilNextTick = Math.max(0, Browser.mainLoop.tickStartTime + value - _emscripten_get_now())|0;
          setTimeout(Browser.mainLoop.runner, timeUntilNextTick);
        };
        Browser.mainLoop.method = 'timeout';
      } else if (mode == 1) {
        Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_rAF() {
          Browser.requestAnimationFrame(Browser.mainLoop.runner);
        };
        Browser.mainLoop.method = 'rAF';
      } else if (mode == 2) {
        if (typeof Browser.setImmediate == 'undefined') {
          if (typeof setImmediate == 'undefined') {

            var setImmediates = [];
            var emscriptenMainLoopMessageId = 'setimmediate';

            var Browser_setImmediate_messageHandler = (event) => {

              if (event.data === emscriptenMainLoopMessageId || event.data.target === emscriptenMainLoopMessageId) {
                event.stopPropagation();
                setImmediates.shift()();
              }
            };
            addEventListener("message", Browser_setImmediate_messageHandler, true);
            Browser.setImmediate =  (function Browser_emulated_setImmediate(func) {
              setImmediates.push(func);
              if (ENVIRONMENT_IS_WORKER) {
                if (Module['setImmediates'] === undefined) Module['setImmediates'] = [];
                Module['setImmediates'].push(func);
                postMessage({target: emscriptenMainLoopMessageId});
              } else postMessage(emscriptenMainLoopMessageId, "*");
            });
          } else {
            Browser.setImmediate = setImmediate;
          }
        }
        Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_setImmediate() {
          Browser.setImmediate(Browser.mainLoop.runner);
        };
        Browser.mainLoop.method = 'immediate';
      }
      return 0;
    };

  var _emscripten_get_now;

      _emscripten_get_now = () => performance.now();
  ;

  var setMainLoop = (browserIterationFunc, fps, simulateInfiniteLoop, arg, noSetTiming) => {
      assert(!Browser.mainLoop.func, 'emscripten_set_main_loop: there can only be one main loop function at once: call emscripten_cancel_main_loop to cancel the previous one before setting a new one with different parameters.');

      Browser.mainLoop.func = browserIterationFunc;
      Browser.mainLoop.arg = arg;

      var thisMainLoopId = (() => Browser.mainLoop.currentlyRunningMainloop)();
      function checkIsRunning() {
        if (thisMainLoopId < Browser.mainLoop.currentlyRunningMainloop) {

          return false;
        }
        return true;
      }

      Browser.mainLoop.running = false;
      Browser.mainLoop.runner = function Browser_mainLoop_runner() {
        if (ABORT) return;
        if (Browser.mainLoop.queue.length > 0) {
          var start = Date.now();
          var blocker = Browser.mainLoop.queue.shift();
          blocker.func(blocker.arg);
          if (Browser.mainLoop.remainingBlockers) {
            var remaining = Browser.mainLoop.remainingBlockers;
            var next = remaining%1 == 0 ? remaining-1 : Math.floor(remaining);
            if (blocker.counted) {
              Browser.mainLoop.remainingBlockers = next;
            } else {

              next = next + 0.5;
              Browser.mainLoop.remainingBlockers = (8*remaining + next)/9;
            }
          }
          Browser.mainLoop.updateStatus();

          if (!checkIsRunning()) return;

          setTimeout(Browser.mainLoop.runner, 0);
          return;
        }

        if (!checkIsRunning()) return;

        Browser.mainLoop.currentFrameNumber = Browser.mainLoop.currentFrameNumber + 1 | 0;
        if (Browser.mainLoop.timingMode == 1 && Browser.mainLoop.timingValue > 1 && Browser.mainLoop.currentFrameNumber % Browser.mainLoop.timingValue != 0) {

          Browser.mainLoop.scheduler();
          return;
        } else if (Browser.mainLoop.timingMode == 0) {
          Browser.mainLoop.tickStartTime = _emscripten_get_now();
        }

        Browser.mainLoop.runIter(browserIterationFunc);

        if (!checkIsRunning()) return;

        if (typeof SDL == 'object' && SDL.audio && SDL.audio.queueNewAudioData) SDL.audio.queueNewAudioData();

        Browser.mainLoop.scheduler();
      }

      if (!noSetTiming) {
        if (fps && fps > 0) {
          _emscripten_set_main_loop_timing(0, 1000.0 / fps);
        } else {

          _emscripten_set_main_loop_timing(1, 1);
        }

        Browser.mainLoop.scheduler();
      }

      if (simulateInfiniteLoop) {
        throw 'unwind';
      }
    };

  var warnOnce = (text) => {
      if (!warnOnce.shown) warnOnce.shown = {};
      if (!warnOnce.shown[text]) {
        warnOnce.shown[text] = 1;
        err(text);
      }
    };

  var Browser = {
  mainLoop:{
  running:false,
  scheduler:null,
  method:"",
  currentlyRunningMainloop:0,
  func:null,
  arg:0,
  timingMode:0,
  timingValue:0,
  currentFrameNumber:0,
  queue:[],
  pause() {
          Browser.mainLoop.scheduler = null;

          Browser.mainLoop.currentlyRunningMainloop++;
        },
  resume() {
          Browser.mainLoop.currentlyRunningMainloop++;
          var timingMode = Browser.mainLoop.timingMode;
          var timingValue = Browser.mainLoop.timingValue;
          var func = Browser.mainLoop.func;
          Browser.mainLoop.func = null;

          setMainLoop(func, 0, false, Browser.mainLoop.arg, true);
          _emscripten_set_main_loop_timing(timingMode, timingValue);
          Browser.mainLoop.scheduler();
        },
  updateStatus() {
          if (Module['setStatus']) {
            var message = Module['statusMessage'] || 'Please wait...';
            var remaining = Browser.mainLoop.remainingBlockers;
            var expected = Browser.mainLoop.expectedBlockers;
            if (remaining) {
              if (remaining < expected) {
                Module['setStatus'](message + ' (' + (expected - remaining) + '/' + expected + ')');
              } else {
                Module['setStatus'](message);
              }
            } else {
              Module['setStatus']('');
            }
          }
        },
  runIter(func) {
          if (ABORT) return;
          if (Module['preMainLoop']) {
            var preRet = Module['preMainLoop']();
            if (preRet === false) {
              return;
            }
          }
          callUserCallback(func);
          if (Module['postMainLoop']) Module['postMainLoop']();
        },
  },
  isFullscreen:false,
  pointerLock:false,
  moduleContextCreatedCallbacks:[],
  workers:[],
  init() {
        if (Browser.initted) return;
        Browser.initted = true;

        var imagePlugin = {};
        imagePlugin['canHandle'] = function imagePlugin_canHandle(name) {
          return !Module.noImageDecoding && /\.(jpg|jpeg|png|bmp)$/i.test(name);
        };
        imagePlugin['handle'] = function imagePlugin_handle(byteArray, name, onload, onerror) {
          var b = new Blob([byteArray], { type: Browser.getMimetype(name) });
          if (b.size !== byteArray.length) {

            b = new Blob([(new Uint8Array(byteArray)).buffer], { type: Browser.getMimetype(name) });
          }
          var url = URL.createObjectURL(b);
          var img = new Image();
          img.onload = () => {
            assert(img.complete, `Image ${name} could not be decoded`);
            var canvas =   (document.createElement('canvas'));
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            preloadedImages[name] = canvas;
            URL.revokeObjectURL(url);
            if (onload) onload(byteArray);
          };
          img.onerror = (event) => {
            err(`Image ${url} could not be decoded`);
            if (onerror) onerror();
          };
          img.src = url;
        };
        preloadPlugins.push(imagePlugin);

        var audioPlugin = {};
        audioPlugin['canHandle'] = function audioPlugin_canHandle(name) {
          return !Module.noAudioDecoding && name.substr(-4) in { '.ogg': 1, '.wav': 1, '.mp3': 1 };
        };
        audioPlugin['handle'] = function audioPlugin_handle(byteArray, name, onload, onerror) {
          var done = false;
          function finish(audio) {
            if (done) return;
            done = true;
            preloadedAudios[name] = audio;
            if (onload) onload(byteArray);
          }
          function fail() {
            if (done) return;
            done = true;
            preloadedAudios[name] = new Audio();
            if (onerror) onerror();
          }
          var b = new Blob([byteArray], { type: Browser.getMimetype(name) });
          var url = URL.createObjectURL(b);
          var audio = new Audio();
          audio.addEventListener('canplaythrough', () => finish(audio), false);
          audio.onerror = function audio_onerror(event) {
            if (done) return;
            err(`warning: browser could not fully decode audio ${name}, trying slower base64 approach`);
            function encode64(data) {
              var BASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
              var PAD = '=';
              var ret = '';
              var leftchar = 0;
              var leftbits = 0;
              for (var i = 0; i < data.length; i++) {
                leftchar = (leftchar << 8) | data[i];
                leftbits += 8;
                while (leftbits >= 6) {
                  var curr = (leftchar >> (leftbits-6)) & 0x3f;
                  leftbits -= 6;
                  ret += BASE[curr];
                }
              }
              if (leftbits == 2) {
                ret += BASE[(leftchar&3) << 4];
                ret += PAD + PAD;
              } else if (leftbits == 4) {
                ret += BASE[(leftchar&0xf) << 2];
                ret += PAD;
              }
              return ret;
            }
            audio.src = 'data:audio/x-' + name.substr(-3) + ';base64,' + encode64(byteArray);
            finish(audio);
          };
          audio.src = url;

          safeSetTimeout(() => {
            finish(audio);
          }, 10000);
        };
        preloadPlugins.push(audioPlugin);

        function pointerLockChange() {
          Browser.pointerLock = document['pointerLockElement'] === Module['canvas'] ||
                                document['mozPointerLockElement'] === Module['canvas'] ||
                                document['webkitPointerLockElement'] === Module['canvas'] ||
                                document['msPointerLockElement'] === Module['canvas'];
        }
        var canvas = Module['canvas'];
        if (canvas) {

          canvas.requestPointerLock = canvas['requestPointerLock'] ||
                                      canvas['mozRequestPointerLock'] ||
                                      canvas['webkitRequestPointerLock'] ||
                                      canvas['msRequestPointerLock'] ||
                                      (() => {});
          canvas.exitPointerLock = document['exitPointerLock'] ||
                                   document['mozExitPointerLock'] ||
                                   document['webkitExitPointerLock'] ||
                                   document['msExitPointerLock'] ||
                                   (() => {});
          canvas.exitPointerLock = canvas.exitPointerLock.bind(document);

          document.addEventListener('pointerlockchange', pointerLockChange, false);
          document.addEventListener('mozpointerlockchange', pointerLockChange, false);
          document.addEventListener('webkitpointerlockchange', pointerLockChange, false);
          document.addEventListener('mspointerlockchange', pointerLockChange, false);

          if (Module['elementPointerLock']) {
            canvas.addEventListener("click", (ev) => {
              if (!Browser.pointerLock && Module['canvas'].requestPointerLock) {
                Module['canvas'].requestPointerLock();
                ev.preventDefault();
              }
            }, false);
          }
        }
      },
  createContext(  canvas, useWebGL, setInModule, webGLContextAttributes) {
        if (useWebGL && Module.ctx && canvas == Module.canvas) return Module.ctx;

        var ctx;
        var contextHandle;
        if (useWebGL) {

          var contextAttributes = {
            antialias: false,
            alpha: false,
            majorVersion: 2,
          };

          if (webGLContextAttributes) {
            for (var attribute in webGLContextAttributes) {
              contextAttributes[attribute] = webGLContextAttributes[attribute];
            }
          }

          if (typeof GL != 'undefined') {
            contextHandle = GL.createContext(canvas, contextAttributes);
            if (contextHandle) {
              ctx = GL.getContext(contextHandle).GLctx;
            }
          }
        } else {
          ctx = canvas.getContext('2d');
        }

        if (!ctx) return null;

        if (setInModule) {
          if (!useWebGL) assert(typeof GLctx == 'undefined', 'cannot set in module if GLctx is used, but we are a non-GL context that would replace it');

          Module.ctx = ctx;
          if (useWebGL) GL.makeContextCurrent(contextHandle);
          Module.useWebGL = useWebGL;
          Browser.moduleContextCreatedCallbacks.forEach((callback) => callback());
          Browser.init();
        }
        return ctx;
      },
  destroyContext(canvas, useWebGL, setInModule) {},
  fullscreenHandlersInstalled:false,
  lockPointer:undefined,
  resizeCanvas:undefined,
  requestFullscreen(lockPointer, resizeCanvas) {
        Browser.lockPointer = lockPointer;
        Browser.resizeCanvas = resizeCanvas;
        if (typeof Browser.lockPointer == 'undefined') Browser.lockPointer = true;
        if (typeof Browser.resizeCanvas == 'undefined') Browser.resizeCanvas = false;

        var canvas = Module['canvas'];
        function fullscreenChange() {
          Browser.isFullscreen = false;
          var canvasContainer = canvas.parentNode;
          if ((document['fullscreenElement'] || document['mozFullScreenElement'] ||
               document['msFullscreenElement'] || document['webkitFullscreenElement'] ||
               document['webkitCurrentFullScreenElement']) === canvasContainer) {
            canvas.exitFullscreen = Browser.exitFullscreen;
            if (Browser.lockPointer) canvas.requestPointerLock();
            Browser.isFullscreen = true;
            if (Browser.resizeCanvas) {
              Browser.setFullscreenCanvasSize();
            } else {
              Browser.updateCanvasDimensions(canvas);
            }
          } else {

            canvasContainer.parentNode.insertBefore(canvas, canvasContainer);
            canvasContainer.parentNode.removeChild(canvasContainer);

            if (Browser.resizeCanvas) {
              Browser.setWindowedCanvasSize();
            } else {
              Browser.updateCanvasDimensions(canvas);
            }
          }
          if (Module['onFullScreen']) Module['onFullScreen'](Browser.isFullscreen);
          if (Module['onFullscreen']) Module['onFullscreen'](Browser.isFullscreen);
        }

        if (!Browser.fullscreenHandlersInstalled) {
          Browser.fullscreenHandlersInstalled = true;
          document.addEventListener('fullscreenchange', fullscreenChange, false);
          document.addEventListener('mozfullscreenchange', fullscreenChange, false);
          document.addEventListener('webkitfullscreenchange', fullscreenChange, false);
          document.addEventListener('MSFullscreenChange', fullscreenChange, false);
        }

        var canvasContainer = document.createElement("div");
        canvas.parentNode.insertBefore(canvasContainer, canvas);
        canvasContainer.appendChild(canvas);

        canvasContainer.requestFullscreen = canvasContainer['requestFullscreen'] ||
                                            canvasContainer['mozRequestFullScreen'] ||
                                            canvasContainer['msRequestFullscreen'] ||
                                           (canvasContainer['webkitRequestFullscreen'] ? () => canvasContainer['webkitRequestFullscreen'](Element['ALLOW_KEYBOARD_INPUT']) : null) ||
                                           (canvasContainer['webkitRequestFullScreen'] ? () => canvasContainer['webkitRequestFullScreen'](Element['ALLOW_KEYBOARD_INPUT']) : null);

        canvasContainer.requestFullscreen();
      },
  exitFullscreen() {

        if (!Browser.isFullscreen) {
          return false;
        }

        var CFS = document['exitFullscreen'] ||
                  document['cancelFullScreen'] ||
                  document['mozCancelFullScreen'] ||
                  document['msExitFullscreen'] ||
                  document['webkitCancelFullScreen'] ||
            (() => {});
        CFS.apply(document, []);
        return true;
      },
  nextRAF:0,
  fakeRequestAnimationFrame(func) {

        var now = Date.now();
        if (Browser.nextRAF === 0) {
          Browser.nextRAF = now + 1000/60;
        } else {
          while (now + 2 >= Browser.nextRAF) {
            Browser.nextRAF += 1000/60;
          }
        }
        var delay = Math.max(Browser.nextRAF - now, 0);
        setTimeout(func, delay);
      },
  requestAnimationFrame(func) {
        if (typeof requestAnimationFrame == 'function') {
          requestAnimationFrame(func);
          return;
        }
        var RAF = Browser.fakeRequestAnimationFrame;
        RAF(func);
      },
  safeSetTimeout(func, timeout) {

        return safeSetTimeout(func, timeout);
      },
  safeRequestAnimationFrame(func) {

        return Browser.requestAnimationFrame(() => {

          callUserCallback(func);
        });
      },
  getMimetype(name) {
        return {
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'png': 'image/png',
          'bmp': 'image/bmp',
          'ogg': 'audio/ogg',
          'wav': 'audio/wav',
          'mp3': 'audio/mpeg'
        }[name.substr(name.lastIndexOf('.')+1)];
      },
  getUserMedia(func) {
        if (!window.getUserMedia) {
          window.getUserMedia = navigator['getUserMedia'] ||
                                navigator['mozGetUserMedia'];
        }
        window.getUserMedia(func);
      },
  getMovementX(event) {
        return event['movementX'] ||
               event['mozMovementX'] ||
               event['webkitMovementX'] ||
               0;
      },
  getMovementY(event) {
        return event['movementY'] ||
               event['mozMovementY'] ||
               event['webkitMovementY'] ||
               0;
      },
  getMouseWheelDelta(event) {
        var delta = 0;
        switch (event.type) {
          case 'DOMMouseScroll':

            delta = event.detail / 3;
            break;
          case 'mousewheel':

            delta = event.wheelDelta / 120;
            break;
          case 'wheel':
            delta = event.deltaY
            switch (event.deltaMode) {
              case 0:

                delta /= 100;
                break;
              case 1:

                delta /= 3;
                break;
              case 2:

                delta *= 80;
                break;
              default:
                throw 'unrecognized mouse wheel delta mode: ' + event.deltaMode;
            }
            break;
          default:
            throw 'unrecognized mouse wheel event: ' + event.type;
        }
        return delta;
      },
  mouseX:0,
  mouseY:0,
  mouseMovementX:0,
  mouseMovementY:0,
  touches:{
  },
  lastTouches:{
  },
  calculateMouseEvent(event) {
        if (Browser.pointerLock) {

          if (event.type != 'mousemove' &&
              ('mozMovementX' in event)) {
            Browser.mouseMovementX = Browser.mouseMovementY = 0;
          } else {
            Browser.mouseMovementX = Browser.getMovementX(event);
            Browser.mouseMovementY = Browser.getMovementY(event);
          }

          if (typeof SDL != "undefined") {
            Browser.mouseX = SDL.mouseX + Browser.mouseMovementX;
            Browser.mouseY = SDL.mouseY + Browser.mouseMovementY;
          } else {

            Browser.mouseX += Browser.mouseMovementX;
            Browser.mouseY += Browser.mouseMovementY;
          }
        } else {

          var rect = Module["canvas"].getBoundingClientRect();
          var cw = Module["canvas"].width;
          var ch = Module["canvas"].height;

          var scrollX = ((typeof window.scrollX != 'undefined') ? window.scrollX : window.pageXOffset);
          var scrollY = ((typeof window.scrollY != 'undefined') ? window.scrollY : window.pageYOffset);

          if (event.type === 'touchstart' || event.type === 'touchend' || event.type === 'touchmove') {
            var touch = event.touch;
            if (touch === undefined) {
              return;

            }
            var adjustedX = touch.pageX - (scrollX + rect.left);
            var adjustedY = touch.pageY - (scrollY + rect.top);

            adjustedX = adjustedX * (cw / rect.width);
            adjustedY = adjustedY * (ch / rect.height);

            var coords = { x: adjustedX, y: adjustedY };

            if (event.type === 'touchstart') {
              Browser.lastTouches[touch.identifier] = coords;
              Browser.touches[touch.identifier] = coords;
            } else if (event.type === 'touchend' || event.type === 'touchmove') {
              var last = Browser.touches[touch.identifier];
              if (!last) last = coords;
              Browser.lastTouches[touch.identifier] = last;
              Browser.touches[touch.identifier] = coords;
            }
            return;
          }

          var x = event.pageX - (scrollX + rect.left);
          var y = event.pageY - (scrollY + rect.top);

          x = x * (cw / rect.width);
          y = y * (ch / rect.height);

          Browser.mouseMovementX = x - Browser.mouseX;
          Browser.mouseMovementY = y - Browser.mouseY;
          Browser.mouseX = x;
          Browser.mouseY = y;
        }
      },
  resizeListeners:[],
  updateResizeListeners() {
        var canvas = Module['canvas'];
        Browser.resizeListeners.forEach((listener) => listener(canvas.width, canvas.height));
      },
  setCanvasSize(width, height, noUpdates) {
        var canvas = Module['canvas'];
        Browser.updateCanvasDimensions(canvas, width, height);
        if (!noUpdates) Browser.updateResizeListeners();
      },
  windowedWidth:0,
  windowedHeight:0,
  setFullscreenCanvasSize() {

        if (typeof SDL != "undefined") {
          var flags = HEAPU32[((SDL.screen)>>2)];
          flags = flags | 0x00800000;
          HEAP32[((SDL.screen)>>2)] = flags;
        }
        Browser.updateCanvasDimensions(Module['canvas']);
        Browser.updateResizeListeners();
      },
  setWindowedCanvasSize() {

        if (typeof SDL != "undefined") {
          var flags = HEAPU32[((SDL.screen)>>2)];
          flags = flags & ~0x00800000;
          HEAP32[((SDL.screen)>>2)] = flags;
        }
        Browser.updateCanvasDimensions(Module['canvas']);
        Browser.updateResizeListeners();
      },
  updateCanvasDimensions(canvas, wNative, hNative) {
        if (wNative && hNative) {
          canvas.widthNative = wNative;
          canvas.heightNative = hNative;
        } else {
          wNative = canvas.widthNative;
          hNative = canvas.heightNative;
        }
        var w = wNative;
        var h = hNative;
        if (Module['forcedAspectRatio'] && Module['forcedAspectRatio'] > 0) {
          if (w/h < Module['forcedAspectRatio']) {
            w = Math.round(h * Module['forcedAspectRatio']);
          } else {
            h = Math.round(w / Module['forcedAspectRatio']);
          }
        }
        if (((document['fullscreenElement'] || document['mozFullScreenElement'] ||
             document['msFullscreenElement'] || document['webkitFullscreenElement'] ||
             document['webkitCurrentFullScreenElement']) === canvas.parentNode) && (typeof screen != 'undefined')) {
           var factor = Math.min(screen.width / w, screen.height / h);
           w = Math.round(w * factor);
           h = Math.round(h * factor);
        }
        if (Browser.resizeCanvas) {
          if (canvas.width  != w) canvas.width  = w;
          if (canvas.height != h) canvas.height = h;
          if (typeof canvas.style != 'undefined') {
            canvas.style.removeProperty( "width");
            canvas.style.removeProperty("height");
          }
        } else {
          if (canvas.width  != wNative) canvas.width  = wNative;
          if (canvas.height != hNative) canvas.height = hNative;
          if (typeof canvas.style != 'undefined') {
            if (w != wNative || h != hNative) {
              canvas.style.setProperty( "width", w + "px", "important");
              canvas.style.setProperty("height", h + "px", "important");
            } else {
              canvas.style.removeProperty( "width");
              canvas.style.removeProperty("height");
            }
          }
        }
      },
  };

  var wasmTableMirror = [];

  var wasmTable;
  var getWasmTableEntry = (funcPtr) => {
      var func = wasmTableMirror[funcPtr];
      if (!func) {
        if (funcPtr >= wasmTableMirror.length) wasmTableMirror.length = funcPtr + 1;
        wasmTableMirror[funcPtr] = func = wasmTable.get(funcPtr);
      }
      return func;
    };
  var _emscripten_async_call = (func, arg, millis) => {
      function wrapper() {
        getWasmTableEntry(func)(arg);
      }

      if (millis >= 0
      ) {
        safeSetTimeout(wrapper, millis);
      } else {
        Browser.safeRequestAnimationFrame(wrapper);
      }
    };

  var _emscripten_cancel_main_loop = () => {
      Browser.mainLoop.pause();
      Browser.mainLoop.func = null;
    };

  var _emscripten_date_now = () => Date.now();

  var _emscripten_get_device_pixel_ratio = () => {
      return devicePixelRatio;
    };

  var withStackSave = (f) => {
      var stack = stackSave();
      var ret = f();
      stackRestore(stack);
      return ret;
    };
  var JSEvents = {
  inEventHandler:0,
  removeAllEventListeners() {
        for (var i = JSEvents.eventHandlers.length-1; i >= 0; --i) {
          JSEvents._removeHandler(i);
        }
        JSEvents.eventHandlers = [];
        JSEvents.deferredCalls = [];
      },
  registerRemoveEventListeners() {
        if (!JSEvents.removeEventListenersRegistered) {
          __ATEXIT__.push(JSEvents.removeAllEventListeners);
          JSEvents.removeEventListenersRegistered = true;
        }
      },
  deferredCalls:[],
  deferCall(targetFunction, precedence, argsList) {
        function arraysHaveEqualContent(arrA, arrB) {
          if (arrA.length != arrB.length) return false;

          for (var i in arrA) {
            if (arrA[i] != arrB[i]) return false;
          }
          return true;
        }

        for (var i in JSEvents.deferredCalls) {
          var call = JSEvents.deferredCalls[i];
          if (call.targetFunction == targetFunction && arraysHaveEqualContent(call.argsList, argsList)) {
            return;
          }
        }
        JSEvents.deferredCalls.push({
          targetFunction,
          precedence,
          argsList
        });

        JSEvents.deferredCalls.sort((x,y) => x.precedence < y.precedence);
      },
  removeDeferredCalls(targetFunction) {
        for (var i = 0; i < JSEvents.deferredCalls.length; ++i) {
          if (JSEvents.deferredCalls[i].targetFunction == targetFunction) {
            JSEvents.deferredCalls.splice(i, 1);
            --i;
          }
        }
      },
  canPerformEventHandlerRequests() {
        if (navigator.userActivation) {

          return navigator.userActivation.isActive;
        }

        return JSEvents.inEventHandler && JSEvents.currentEventHandler.allowsDeferredCalls;
      },
  runDeferredCalls() {
        if (!JSEvents.canPerformEventHandlerRequests()) {
          return;
        }
        for (var i = 0; i < JSEvents.deferredCalls.length; ++i) {
          var call = JSEvents.deferredCalls[i];
          JSEvents.deferredCalls.splice(i, 1);
          --i;
          call.targetFunction.apply(null, call.argsList);
        }
      },
  eventHandlers:[],
  removeAllHandlersOnTarget:(target, eventTypeString) => {
        for (var i = 0; i < JSEvents.eventHandlers.length; ++i) {
          if (JSEvents.eventHandlers[i].target == target &&
            (!eventTypeString || eventTypeString == JSEvents.eventHandlers[i].eventTypeString)) {
             JSEvents._removeHandler(i--);
           }
        }
      },
  _removeHandler(i) {
        var h = JSEvents.eventHandlers[i];
        h.target.removeEventListener(h.eventTypeString, h.eventListenerFunc, h.useCapture);
        JSEvents.eventHandlers.splice(i, 1);
      },
  registerOrRemoveHandler(eventHandler) {
        if (!eventHandler.target) {
          return -4;
        }
        var jsEventHandler = function jsEventHandler(event) {

          ++JSEvents.inEventHandler;
          JSEvents.currentEventHandler = eventHandler;

          JSEvents.runDeferredCalls();

          eventHandler.handlerFunc(event);

          JSEvents.runDeferredCalls();

          --JSEvents.inEventHandler;
        };

        if (eventHandler.callbackfunc) {
          eventHandler.eventListenerFunc = jsEventHandler;
          eventHandler.target.addEventListener(eventHandler.eventTypeString, jsEventHandler, eventHandler.useCapture);
          JSEvents.eventHandlers.push(eventHandler);
          JSEvents.registerRemoveEventListeners();
        } else {
          for (var i = 0; i < JSEvents.eventHandlers.length; ++i) {
            if (JSEvents.eventHandlers[i].target == eventHandler.target
             && JSEvents.eventHandlers[i].eventTypeString == eventHandler.eventTypeString) {
               JSEvents._removeHandler(i--);
             }
          }
        }
        return 0;
      },
  getNodeNameForTarget(target) {
        if (!target) return '';
        if (target == window) return '#window';
        if (target == screen) return '#screen';
        return (target && target.nodeName) ? target.nodeName : '';
      },
  fullscreenEnabled() {
        return document.fullscreenEnabled

        || document.webkitFullscreenEnabled
         ;
      },
  };

  var maybeCStringToJsString = (cString) => {

      return cString > 2 ? UTF8ToString(cString) : cString;
    };

  var specialHTMLTargets = [0, document, window];
  var findEventTarget = (target) => {
      target = maybeCStringToJsString(target);
      var domElement = specialHTMLTargets[target] || document.querySelector(target);
      return domElement;
    };

  var getBoundingClientRect = (e) => specialHTMLTargets.indexOf(e) < 0 ? e.getBoundingClientRect() : {'left':0,'top':0};
  var _emscripten_get_element_css_size = (target, width, height) => {
      target = findEventTarget(target);
      if (!target) return -4;

      var rect = getBoundingClientRect(target);
      HEAPF64[((width)>>3)] = rect.width;
      HEAPF64[((height)>>3)] = rect.height;

      return 0;
    };

  var getHeapMax = () =>

      2147483648;
  var _emscripten_get_heap_max = () => getHeapMax();

  var _emscripten_memcpy_js = (dest, src, num) => HEAPU8.copyWithin(dest, src, src + num);

  var growMemory = (size) => {
      var b = wasmMemory.buffer;
      var pages = (size - b.byteLength + 65535) / 65536;
      try {

        wasmMemory.grow(pages);
        updateMemoryViews();
        return 1  ;
      } catch(e) {
      }

    };
  var _emscripten_resize_heap = (requestedSize) => {
      var oldSize = HEAPU8.length;

      requestedSize >>>= 0;

      var maxHeapSize = getHeapMax();
      if (requestedSize > maxHeapSize) {
        return false;
      }

      var alignUp = (x, multiple) => x + (multiple - x % multiple) % multiple;

      for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
        var overGrownHeapSize = oldSize * (1 + 0.2 / cutDown);

        overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296 );

        var newSize = Math.min(maxHeapSize, alignUp(Math.max(requestedSize, overGrownHeapSize), 65536));

        var replacement = growMemory(newSize);
        if (replacement) {

          return true;
        }
      }
      return false;
    };

  var findCanvasEventTarget = (target) => findEventTarget(target);
  var _emscripten_set_canvas_element_size = (target, width, height) => {
      var canvas = findCanvasEventTarget(target);
      if (!canvas) return -4;
      canvas.width = width;
      canvas.height = height;
      return 0;
    };

  var _emscripten_set_main_loop = (func, fps, simulateInfiniteLoop) => {
      var browserIterationFunc = getWasmTableEntry(func);
      setMainLoop(browserIterationFunc, fps, simulateInfiniteLoop);
    };

  var fillMouseEventData = (eventStruct, e, target) => {
      HEAPF64[((eventStruct)>>3)] = e.timeStamp;
      var idx = ((eventStruct)>>2);
      HEAP32[idx + 2] = e.screenX;
      HEAP32[idx + 3] = e.screenY;
      HEAP32[idx + 4] = e.clientX;
      HEAP32[idx + 5] = e.clientY;
      HEAP32[idx + 6] = e.ctrlKey;
      HEAP32[idx + 7] = e.shiftKey;
      HEAP32[idx + 8] = e.altKey;
      HEAP32[idx + 9] = e.metaKey;
      HEAP16[idx*2 + 20] = e.button;
      HEAP16[idx*2 + 21] = e.buttons;

      HEAP32[idx + 11] = e["movementX"]
        ;

      HEAP32[idx + 12] = e["movementY"]
        ;

      var rect = getBoundingClientRect(target);
      HEAP32[idx + 13] = e.clientX - rect.left;
      HEAP32[idx + 14] = e.clientY - rect.top;

    };

  var registerMouseEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) => {
      if (!JSEvents.mouseEvent) JSEvents.mouseEvent = _malloc(72);
      target = findEventTarget(target);

      var mouseEventHandlerFunc = (e = event) => {

        fillMouseEventData(JSEvents.mouseEvent, e, target);

        if (getWasmTableEntry(callbackfunc)(eventTypeId, JSEvents.mouseEvent, userData)) e.preventDefault();
      };

      var eventHandler = {
        target,
        allowsDeferredCalls: eventTypeString != 'mousemove' && eventTypeString != 'mouseenter' && eventTypeString != 'mouseleave',
        eventTypeString,
        callbackfunc,
        handlerFunc: mouseEventHandlerFunc,
        useCapture
      };
      return JSEvents.registerOrRemoveHandler(eventHandler);
    };
  var _emscripten_set_mousedown_callback_on_thread = (target, userData, useCapture, callbackfunc, targetThread) =>
      registerMouseEventCallback(target, userData, useCapture, callbackfunc, 5, "mousedown", targetThread);

  var _emscripten_set_mouseleave_callback_on_thread = (target, userData, useCapture, callbackfunc, targetThread) =>
      registerMouseEventCallback(target, userData, useCapture, callbackfunc, 34, "mouseleave", targetThread);

  var _emscripten_set_mousemove_callback_on_thread = (target, userData, useCapture, callbackfunc, targetThread) =>
      registerMouseEventCallback(target, userData, useCapture, callbackfunc, 8, "mousemove", targetThread);

  var _emscripten_set_mouseup_callback_on_thread = (target, userData, useCapture, callbackfunc, targetThread) =>
      registerMouseEventCallback(target, userData, useCapture, callbackfunc, 6, "mouseup", targetThread);

  var registerWheelEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) => {
      if (!JSEvents.wheelEvent) JSEvents.wheelEvent = _malloc(104);

      var wheelHandlerFunc = (e = event) => {
        var wheelEvent = JSEvents.wheelEvent;
        fillMouseEventData(wheelEvent, e, target);
        HEAPF64[(((wheelEvent)+(72))>>3)] = e["deltaX"];
        HEAPF64[(((wheelEvent)+(80))>>3)] = e["deltaY"];
        HEAPF64[(((wheelEvent)+(88))>>3)] = e["deltaZ"];
        HEAP32[(((wheelEvent)+(96))>>2)] = e["deltaMode"];
        if (getWasmTableEntry(callbackfunc)(eventTypeId, wheelEvent, userData)) e.preventDefault();
      };

      var eventHandler = {
        target,
        allowsDeferredCalls: true,
        eventTypeString,
        callbackfunc,
        handlerFunc: wheelHandlerFunc,
        useCapture
      };
      return JSEvents.registerOrRemoveHandler(eventHandler);
    };

  var _emscripten_set_wheel_callback_on_thread = (target, userData, useCapture, callbackfunc, targetThread) => {
      target = findEventTarget(target);
      if (!target) return -4;
      if (typeof target.onwheel != 'undefined') {
        return registerWheelEventCallback(target, userData, useCapture, callbackfunc, 9, "wheel", targetThread);
      } else {
        return -1;
      }
    };

  var webgl_enable_WEBGL_draw_instanced_base_vertex_base_instance = (ctx) =>

      !!(ctx.dibvbi = ctx.getExtension('WEBGL_draw_instanced_base_vertex_base_instance'));

  var webgl_enable_WEBGL_multi_draw_instanced_base_vertex_base_instance = (ctx) => {

      return !!(ctx.mdibvbi = ctx.getExtension('WEBGL_multi_draw_instanced_base_vertex_base_instance'));
    };

  var webgl_enable_WEBGL_multi_draw = (ctx) => {

      return !!(ctx.multiDrawWebgl = ctx.getExtension('WEBGL_multi_draw'));
    };

  var GL = {
  counter:1,
  buffers:[],
  programs:[],
  framebuffers:[],
  renderbuffers:[],
  textures:[],
  shaders:[],
  vaos:[],
  contexts:[],
  offscreenCanvases:{
  },
  queries:[],
  samplers:[],
  transformFeedbacks:[],
  syncs:[],
  stringCache:{
  },
  stringiCache:{
  },
  unpackAlignment:4,
  recordError:function recordError(errorCode) {
        if (!GL.lastError) {
          GL.lastError = errorCode;
        }
      },
  getNewId:(table) => {
        var ret = GL.counter++;
        for (var i = table.length; i < ret; i++) {
          table[i] = null;
        }
        return ret;
      },
  getSource:(shader, count, string, length) => {
        var source = '';
        for (var i = 0; i < count; ++i) {
          var len = length ? HEAP32[(((length)+(i*4))>>2)] : -1;
          source += UTF8ToString(HEAP32[(((string)+(i*4))>>2)], len < 0 ? undefined : len);
        }
        return source;
      },
  createContext:(  canvas, webGLContextAttributes) => {

        if (!canvas.getContextSafariWebGL2Fixed) {
          canvas.getContextSafariWebGL2Fixed = canvas.getContext;

          function fixedGetContext(ver, attrs) {
            var gl = canvas.getContextSafariWebGL2Fixed(ver, attrs);
            return ((ver == 'webgl') == (gl instanceof WebGLRenderingContext)) ? gl : null;
          }
          canvas.getContext = fixedGetContext;
        }

        var ctx = canvas.getContext("webgl2", webGLContextAttributes);

        if (!ctx) return 0;

        var handle = GL.registerContext(ctx, webGLContextAttributes);

        return handle;
      },
  registerContext:(ctx, webGLContextAttributes) => {

        var handle = GL.getNewId(GL.contexts);

        var context = {
          handle,
          attributes: webGLContextAttributes,
          version: webGLContextAttributes.majorVersion,
          GLctx: ctx
        };

        if (ctx.canvas) ctx.canvas.GLctxObject = context;
        GL.contexts[handle] = context;
        if (typeof webGLContextAttributes.enableExtensionsByDefault == 'undefined' || webGLContextAttributes.enableExtensionsByDefault) {
          GL.initExtensions(context);
        }

        return handle;
      },
  makeContextCurrent:(contextHandle) => {

        GL.currentContext = GL.contexts[contextHandle];

        Module.ctx = GLctx = GL.currentContext && GL.currentContext.GLctx;
        return !(contextHandle && !GLctx);
      },
  getContext:(contextHandle) => {
        return GL.contexts[contextHandle];
      },
  deleteContext:(contextHandle) => {
        if (GL.currentContext === GL.contexts[contextHandle]) {
          GL.currentContext = null;
        }
        if (typeof JSEvents == 'object') {

          JSEvents.removeAllHandlersOnTarget(GL.contexts[contextHandle].GLctx.canvas);
        }

        if (GL.contexts[contextHandle] && GL.contexts[contextHandle].GLctx.canvas) {
          GL.contexts[contextHandle].GLctx.canvas.GLctxObject = undefined;
        }
        GL.contexts[contextHandle] = null;
      },
  initExtensions:(context) => {

        if (!context) context = GL.currentContext;

        if (context.initExtensionsDone) return;
        context.initExtensionsDone = true;

        var GLctx = context.GLctx;

        webgl_enable_WEBGL_draw_instanced_base_vertex_base_instance(GLctx);
        webgl_enable_WEBGL_multi_draw_instanced_base_vertex_base_instance(GLctx);

        if (context.version >= 2) {
          GLctx.disjointTimerQueryExt = GLctx.getExtension("EXT_disjoint_timer_query_webgl2");
        }

        if (context.version < 2 || !GLctx.disjointTimerQueryExt)
        {
          GLctx.disjointTimerQueryExt = GLctx.getExtension("EXT_disjoint_timer_query");
        }

        webgl_enable_WEBGL_multi_draw(GLctx);

        var exts = GLctx.getSupportedExtensions() || [];
        exts.forEach((ext) => {

          if (!ext.includes('lose_context') && !ext.includes('debug')) {

            GLctx.getExtension(ext);
          }
        });
      },
  getExtensions() {

        var exts = GLctx.getSupportedExtensions() || [];
        exts = exts.concat(exts.map((e) => "GL_" + e));
        return exts;
      },
  };

  var emscripten_webgl_power_preferences = ['default', 'low-power', 'high-performance'];

  var _emscripten_webgl_do_create_context = (target, attributes) => {
      var a = attributes >> 2;
      var powerPreference = HEAP32[a + (24>>2)];
      var contextAttributes = {
        'alpha': !!HEAP32[a + (0>>2)],
        'depth': !!HEAP32[a + (4>>2)],
        'stencil': !!HEAP32[a + (8>>2)],
        'antialias': !!HEAP32[a + (12>>2)],
        'premultipliedAlpha': !!HEAP32[a + (16>>2)],
        'preserveDrawingBuffer': !!HEAP32[a + (20>>2)],
        'powerPreference': emscripten_webgl_power_preferences[powerPreference],
        'failIfMajorPerformanceCaveat': !!HEAP32[a + (28>>2)],

        majorVersion: HEAP32[a + (32>>2)],
        minorVersion: HEAP32[a + (36>>2)],
        enableExtensionsByDefault: HEAP32[a + (40>>2)],
        explicitSwapControl: HEAP32[a + (44>>2)],
        proxyContextToMainThread: HEAP32[a + (48>>2)],
        renderViaOffscreenBackBuffer: HEAP32[a + (52>>2)]
      };

      var canvas = findCanvasEventTarget(target);

      if (!canvas) {
        return 0;
      }

      if (contextAttributes.explicitSwapControl) {
        return 0;
      }

      var contextHandle = GL.createContext(canvas, contextAttributes);
      return contextHandle;
    };
  var _emscripten_webgl_create_context = _emscripten_webgl_do_create_context;

  var _emscripten_webgl_enable_extension = (contextHandle, extension) => {
      var context = GL.getContext(contextHandle);
      var extString = UTF8ToString(extension);
      if (extString.startsWith('GL_')) extString = extString.substr(3);

      if (extString == 'WEBGL_draw_instanced_base_vertex_base_instance') webgl_enable_WEBGL_draw_instanced_base_vertex_base_instance(GLctx);
      if (extString == 'WEBGL_multi_draw_instanced_base_vertex_base_instance') webgl_enable_WEBGL_multi_draw_instanced_base_vertex_base_instance(GLctx);

      if (extString == 'WEBGL_multi_draw') webgl_enable_WEBGL_multi_draw(GLctx);

      var ext = context.GLctx.getExtension(extString);
      return !!ext;
    };

  var _emscripten_webgl_init_context_attributes = (attributes) => {
      var a = attributes >> 2;
      for (var i = 0; i < (56>>2); ++i) {
        HEAP32[a+i] = 0;
      }

      HEAP32[a + (0>>2)] =
      HEAP32[a + (4>>2)] =
      HEAP32[a + (12>>2)] =
      HEAP32[a + (16>>2)] =
      HEAP32[a + (32>>2)] =
      HEAP32[a + (40>>2)] = 1;

    };

  var _emscripten_webgl_make_context_current = (contextHandle) => {
      var success = GL.makeContextCurrent(contextHandle);
      return success ? 0 : -5;
    };

  var ENV = {
  };

  var getExecutableName = () => {
      return thisProgram || './this.program';
    };
  var getEnvStrings = () => {
      if (!getEnvStrings.strings) {

        var lang = ((typeof navigator == 'object' && navigator.languages && navigator.languages[0]) || 'C').replace('-', '_') + '.UTF-8';
        var env = {
          'USER': 'web_user',
          'LOGNAME': 'web_user',
          'PATH': '/',
          'PWD': '/',
          'HOME': '/home/web_user',
          'LANG': lang,
          '_': getExecutableName()
        };

        for (var x in ENV) {

          if (ENV[x] === undefined) delete env[x];
          else env[x] = ENV[x];
        }
        var strings = [];
        for (var x in env) {
          strings.push(`${x}=${env[x]}`);
        }
        getEnvStrings.strings = strings;
      }
      return getEnvStrings.strings;
    };

  var stringToAscii = (str, buffer) => {
      for (var i = 0; i < str.length; ++i) {
        HEAP8[((buffer++)>>0)] = str.charCodeAt(i);
      }

      HEAP8[((buffer)>>0)] = 0;
    };

  var _environ_get = (__environ, environ_buf) => {
      var bufSize = 0;
      getEnvStrings().forEach((string, i) => {
        var ptr = environ_buf + bufSize;
        HEAPU32[(((__environ)+(i*4))>>2)] = ptr;
        stringToAscii(string, ptr);
        bufSize += string.length + 1;
      });
      return 0;
    };

  var _environ_sizes_get = (penviron_count, penviron_buf_size) => {
      var strings = getEnvStrings();
      HEAPU32[((penviron_count)>>2)] = strings.length;
      var bufSize = 0;
      strings.forEach((string) => bufSize += string.length + 1);
      HEAPU32[((penviron_buf_size)>>2)] = bufSize;
      return 0;
    };

  function _fd_close(fd) {
  try {

      var stream = SYSCALLS.getStreamFromFD(fd);
      FS.close(stream);
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return e.errno;
  }
  }

  var doReadv = (stream, iov, iovcnt, offset) => {
      var ret = 0;
      for (var i = 0; i < iovcnt; i++) {
        var ptr = HEAPU32[((iov)>>2)];
        var len = HEAPU32[(((iov)+(4))>>2)];
        iov += 8;
        var curr = FS.read(stream, HEAP8, ptr, len, offset);
        if (curr < 0) return -1;
        ret += curr;
        if (curr < len) break;
        if (typeof offset !== 'undefined') {
          offset += curr;
        }
      }
      return ret;
    };

  function _fd_read(fd, iov, iovcnt, pnum) {
  try {

      var stream = SYSCALLS.getStreamFromFD(fd);
      var num = doReadv(stream, iov, iovcnt);
      HEAPU32[((pnum)>>2)] = num;
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return e.errno;
  }
  }

  function _fd_seek(fd,offset_low, offset_high,whence,newOffset) {
    var offset = convertI32PairToI53Checked(offset_low, offset_high);;

  try {

      if (isNaN(offset)) return 61;
      var stream = SYSCALLS.getStreamFromFD(fd);
      FS.llseek(stream, offset, whence);
      (tempI64 = [stream.position>>>0,(tempDouble = stream.position,(+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? (+(Math.floor((tempDouble)/4294967296.0)))>>>0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)], HEAP32[((newOffset)>>2)] = tempI64[0],HEAP32[(((newOffset)+(4))>>2)] = tempI64[1]);
      if (stream.getdents && offset === 0 && whence === 0) stream.getdents = null;
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return e.errno;
  }
  ;
  }

  var doWritev = (stream, iov, iovcnt, offset) => {
      var ret = 0;
      for (var i = 0; i < iovcnt; i++) {
        var ptr = HEAPU32[((iov)>>2)];
        var len = HEAPU32[(((iov)+(4))>>2)];
        iov += 8;
        var curr = FS.write(stream, HEAP8, ptr, len, offset);
        if (curr < 0) return -1;
        ret += curr;
        if (typeof offset !== 'undefined') {
          offset += curr;
        }
      }
      return ret;
    };

  function _fd_write(fd, iov, iovcnt, pnum) {
  try {

      var stream = SYSCALLS.getStreamFromFD(fd);
      var num = doWritev(stream, iov, iovcnt);
      HEAPU32[((pnum)>>2)] = num;
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return e.errno;
  }
  }

  function _glActiveTexture(x0) { GLctx.activeTexture(x0) }

  var _glAttachShader = (program, shader) => {
      GLctx.attachShader(GL.programs[program], GL.shaders[shader]);
    };

  var _glBindAttribLocation = (program, index, name) => {
      GLctx.bindAttribLocation(GL.programs[program], index, UTF8ToString(name));
    };

  var _glBindBuffer = (target, buffer) => {

      if (target == 0x88EB  ) {

        GLctx.currentPixelPackBufferBinding = buffer;
      } else if (target == 0x88EC  ) {

        GLctx.currentPixelUnpackBufferBinding = buffer;
      }
      GLctx.bindBuffer(target, GL.buffers[buffer]);
    };

  var _glBindTexture = (target, texture) => {
      GLctx.bindTexture(target, GL.textures[texture]);
    };

  var _glBindVertexArray = (vao) => {
      GLctx.bindVertexArray(GL.vaos[vao]);
    };

  function _glBlendEquation(x0) { GLctx.blendEquation(x0) }

  function _glBlendFunc(x0, x1) { GLctx.blendFunc(x0, x1) }

  var _glBufferData = (target, size, data, usage) => {

      if (true) {

        if (data && size) {
          GLctx.bufferData(target, HEAPU8, usage, data, size);
        } else {
          GLctx.bufferData(target, size, usage);
        }
      } else {

        GLctx.bufferData(target, data ? HEAPU8.subarray(data, data+size) : size, usage);
      }
    };

  var _glBufferSubData = (target, offset, size, data) => {
      if (true) {

        size && GLctx.bufferSubData(target, offset, HEAPU8, data, size);
        return;
      }
      GLctx.bufferSubData(target, offset, HEAPU8.subarray(data, data+size));
    };

  function _glClear(x0) { GLctx.clear(x0) }

  function _glClearColor(x0, x1, x2, x3) { GLctx.clearColor(x0, x1, x2, x3) }

  var _glCompileShader = (shader) => {
      GLctx.compileShader(GL.shaders[shader]);
    };

  var _glCreateProgram = () => {
      var id = GL.getNewId(GL.programs);
      var program = GLctx.createProgram();

      program.name = id;

      program.maxUniformLength = program.maxAttributeLength = program.maxUniformBlockNameLength = 0;
      program.uniformIdCounter = 1;
      GL.programs[id] = program;
      return id;
    };

  var _glCreateShader = (shaderType) => {
      var id = GL.getNewId(GL.shaders);
      GL.shaders[id] = GLctx.createShader(shaderType);

      return id;
    };

  var _glDeleteBuffers = (n, buffers) => {
      for (var i = 0; i < n; i++) {
        var id = HEAP32[(((buffers)+(i*4))>>2)];
        var buffer = GL.buffers[id];

        if (!buffer) continue;

        GLctx.deleteBuffer(buffer);
        buffer.name = 0;
        GL.buffers[id] = null;

        if (id == GLctx.currentPixelPackBufferBinding) GLctx.currentPixelPackBufferBinding = 0;
        if (id == GLctx.currentPixelUnpackBufferBinding) GLctx.currentPixelUnpackBufferBinding = 0;
      }
    };

  var _glDeleteProgram = (id) => {
      if (!id) return;
      var program = GL.programs[id];
      if (!program) {

        GL.recordError(0x501  );
        return;
      }
      GLctx.deleteProgram(program);
      program.name = 0;
      GL.programs[id] = null;
    };

  var _glDeleteShader = (id) => {
      if (!id) return;
      var shader = GL.shaders[id];
      if (!shader) {

        GL.recordError(0x501  );
        return;
      }
      GLctx.deleteShader(shader);
      GL.shaders[id] = null;
    };

  var _glDeleteTextures = (n, textures) => {
      for (var i = 0; i < n; i++) {
        var id = HEAP32[(((textures)+(i*4))>>2)];
        var texture = GL.textures[id];

        if (!texture) continue;
        GLctx.deleteTexture(texture);
        texture.name = 0;
        GL.textures[id] = null;
      }
    };

  var _glDeleteVertexArrays = (n, vaos) => {
      for (var i = 0; i < n; i++) {
        var id = HEAP32[(((vaos)+(i*4))>>2)];
        GLctx.deleteVertexArray(GL.vaos[id]);
        GL.vaos[id] = null;
      }
    };

  function _glDepthFunc(x0) { GLctx.depthFunc(x0) }

  var _glDepthMask = (flag) => {
      GLctx.depthMask(!!flag);
    };

  function _glDisable(x0) { GLctx.disable(x0) }

  var _glDrawArrays = (mode, first, count) => {

      GLctx.drawArrays(mode, first, count);

    };

  var _glDrawElements = (mode, count, type, indices) => {

      GLctx.drawElements(mode, count, type, indices);

    };

  function _glEnable(x0) { GLctx.enable(x0) }

  var _glEnableVertexAttribArray = (index) => {
      GLctx.enableVertexAttribArray(index);
    };

  function _glFinish() { GLctx.finish() }

  var __glGenObject = (n, buffers, createFunction, objectTable
      ) => {
      for (var i = 0; i < n; i++) {
        var buffer = GLctx[createFunction]();
        var id = buffer && GL.getNewId(objectTable);
        if (buffer) {
          buffer.name = id;
          objectTable[id] = buffer;
        } else {
          GL.recordError(0x502  );
        }
        HEAP32[(((buffers)+(i*4))>>2)] = id;
      }
    };

  var _glGenBuffers = (n, buffers) => {
      __glGenObject(n, buffers, 'createBuffer', GL.buffers
        );
    };

  var _glGenTextures = (n, textures) => {
      __glGenObject(n, textures, 'createTexture', GL.textures
        );
    };

  function _glGenVertexArrays(n, arrays) {
      __glGenObject(n, arrays, 'createVertexArray', GL.vaos
        );
    }

  var __glGetActiveAttribOrUniform = (funcName, program, index, bufSize, length, size, type, name) => {
      program = GL.programs[program];
      var info = GLctx[funcName](program, index);
      if (info) {

        var numBytesWrittenExclNull = name && stringToUTF8(info.name, name, bufSize);
        if (length) HEAP32[((length)>>2)] = numBytesWrittenExclNull;
        if (size) HEAP32[((size)>>2)] = info.size;
        if (type) HEAP32[((type)>>2)] = info.type;
      }
    };

  var _glGetActiveAttrib = (program, index, bufSize, length, size, type, name) => {
      __glGetActiveAttribOrUniform('getActiveAttrib', program, index, bufSize, length, size, type, name);
    };

  var _glGetActiveUniform = (program, index, bufSize, length, size, type, name) => {
      __glGetActiveAttribOrUniform('getActiveUniform', program, index, bufSize, length, size, type, name);
    };

  var _glGetError = () => {
      var error = GLctx.getError() || GL.lastError;
      GL.lastError = 0 ;
      return error;
    };

  var writeI53ToI64 = (ptr, num) => {
      HEAPU32[((ptr)>>2)] = num;
      var lower = HEAPU32[((ptr)>>2)];
      HEAPU32[(((ptr)+(4))>>2)] = (num - lower)/4294967296;
    };

  var emscriptenWebGLGet = (name_, p, type) => {

      if (!p) {
        GL.recordError(0x501  );
        return;
      }
      var ret = undefined;
      switch (name_) {
        case 0x8DFA:
          ret = 1;
          break;
        case 0x8DF8:
          if (type != 0 && type != 1) {
            GL.recordError(0x500);
          }

          return;
        case 0x87FE:
        case 0x8DF9:
          ret = 0;
          break;
        case 0x86A2:

          var formats = GLctx.getParameter(0x86A3  );
          ret = formats ? formats.length : 0;
          break;

        case 0x821D:
          if (GL.currentContext.version < 2) {

            GL.recordError(0x502  );
            return;
          }

          var exts = GLctx.getSupportedExtensions() || [];

          ret = 2 * exts.length;
          break;
        case 0x821B:
        case 0x821C:
          if (GL.currentContext.version < 2) {
            GL.recordError(0x500);
            return;
          }
          ret = name_ == 0x821B ? 3 : 0;
          break;
      }

      if (ret === undefined) {
        var result = GLctx.getParameter(name_);
        switch (typeof result) {
          case "number":
            ret = result;
            break;
          case "boolean":
            ret = result ? 1 : 0;
            break;
          case "string":
            GL.recordError(0x500);
            return;
          case "object":
            if (result === null) {

              switch (name_) {
                case 0x8894:
                case 0x8B8D:
                case 0x8895:
                case 0x8CA6:
                case 0x8CA7:
                case 0x8069:
                case 0x85B5:
                case 0x8F36:
                case 0x8F37:
                case 0x88ED:
                case 0x88EF:
                case 0x8CAA:
                case 0x8919:
                case 0x8C1D:
                case 0x806A:
                case 0x8E25:
                case 0x8C8F:
                case 0x8A28:
                case 0x8514: {
                  ret = 0;
                  break;
                }
                default: {
                  GL.recordError(0x500);
                  return;
                }
              }
            } else if (result instanceof Float32Array ||
                       result instanceof Uint32Array ||
                       result instanceof Int32Array ||
                       result instanceof Array) {
              for (var i = 0; i < result.length; ++i) {
                switch (type) {
                  case 0: HEAP32[(((p)+(i*4))>>2)] = result[i]; break;
                  case 2: HEAPF32[(((p)+(i*4))>>2)] = result[i]; break;
                  case 4: HEAP8[(((p)+(i))>>0)] = result[i] ? 1 : 0; break;
                }
              }
              return;
            } else {
              try {
                ret = result.name | 0;
              } catch(e) {
                GL.recordError(0x500);
                err(`GL_INVALID_ENUM in glGet${type}v: Unknown object returned from WebGL getParameter(${name_})! (error: ${e})`);
                return;
              }
            }
            break;
          default:
            GL.recordError(0x500);
            err(`GL_INVALID_ENUM in glGet${type}v: Native code calling glGet${type}v(${name_}) and it returns ${result} of type ${typeof(result)}!`);
            return;
        }
      }

      switch (type) {
        case 1: writeI53ToI64(p, ret); break;
        case 0: HEAP32[((p)>>2)] = ret; break;
        case 2:   HEAPF32[((p)>>2)] = ret; break;
        case 4: HEAP8[((p)>>0)] = ret ? 1 : 0; break;
      }
    };

  var _glGetIntegerv = (name_, p) => emscriptenWebGLGet(name_, p, 0);

  var _glGetProgramInfoLog = (program, maxLength, length, infoLog) => {
      var log = GLctx.getProgramInfoLog(GL.programs[program]);
      if (log === null) log = '(unknown error)';
      var numBytesWrittenExclNull = (maxLength > 0 && infoLog) ? stringToUTF8(log, infoLog, maxLength) : 0;
      if (length) HEAP32[((length)>>2)] = numBytesWrittenExclNull;
    };

  var _glGetProgramiv = (program, pname, p) => {
      if (!p) {

        GL.recordError(0x501  );
        return;
      }

      if (program >= GL.counter) {
        GL.recordError(0x501  );
        return;
      }

      program = GL.programs[program];

      if (pname == 0x8B84) {
        var log = GLctx.getProgramInfoLog(program);
        if (log === null) log = '(unknown error)';
        HEAP32[((p)>>2)] = log.length + 1;
      } else if (pname == 0x8B87  ) {
        if (!program.maxUniformLength) {
          for (var i = 0; i < GLctx.getProgramParameter(program, 0x8B86 ); ++i) {
            program.maxUniformLength = Math.max(program.maxUniformLength, GLctx.getActiveUniform(program, i).name.length+1);
          }
        }
        HEAP32[((p)>>2)] = program.maxUniformLength;
      } else if (pname == 0x8B8A  ) {
        if (!program.maxAttributeLength) {
          for (var i = 0; i < GLctx.getProgramParameter(program, 0x8B89 ); ++i) {
            program.maxAttributeLength = Math.max(program.maxAttributeLength, GLctx.getActiveAttrib(program, i).name.length+1);
          }
        }
        HEAP32[((p)>>2)] = program.maxAttributeLength;
      } else if (pname == 0x8A35  ) {
        if (!program.maxUniformBlockNameLength) {
          for (var i = 0; i < GLctx.getProgramParameter(program, 0x8A36 ); ++i) {
            program.maxUniformBlockNameLength = Math.max(program.maxUniformBlockNameLength, GLctx.getActiveUniformBlockName(program, i).length+1);
          }
        }
        HEAP32[((p)>>2)] = program.maxUniformBlockNameLength;
      } else {
        HEAP32[((p)>>2)] = GLctx.getProgramParameter(program, pname);
      }
    };

  var _glGetShaderInfoLog = (shader, maxLength, length, infoLog) => {
      var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
      if (log === null) log = '(unknown error)';
      var numBytesWrittenExclNull = (maxLength > 0 && infoLog) ? stringToUTF8(log, infoLog, maxLength) : 0;
      if (length) HEAP32[((length)>>2)] = numBytesWrittenExclNull;
    };

  var _glGetShaderiv = (shader, pname, p) => {
      if (!p) {

        GL.recordError(0x501  );
        return;
      }
      if (pname == 0x8B84) {
        var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
        if (log === null) log = '(unknown error)';

        var logLength = log ? log.length + 1 : 0;
        HEAP32[((p)>>2)] = logLength;
      } else if (pname == 0x8B88) {
        var source = GLctx.getShaderSource(GL.shaders[shader]);

        var sourceLength = source ? source.length + 1 : 0;
        HEAP32[((p)>>2)] = sourceLength;
      } else {
        HEAP32[((p)>>2)] = GLctx.getShaderParameter(GL.shaders[shader], pname);
      }
    };

  var _glGetString = (name_) => {
      var ret = GL.stringCache[name_];
      if (!ret) {
        switch (name_) {
          case 0x1F03  :
            ret = stringToNewUTF8(GL.getExtensions().join(' '));
            break;
          case 0x1F00  :
          case 0x1F01  :
          case 0x9245  :
          case 0x9246  :
            var s = GLctx.getParameter(name_);
            if (!s) {
              GL.recordError(0x500 );
            }
            ret = s ? stringToNewUTF8(s) : 0;
            break;

          case 0x1F02  :
            var glVersion = GLctx.getParameter(0x1F02  );

            if (true) glVersion = `OpenGL ES 3.0 (${glVersion})`;
            else
            {
              glVersion = `OpenGL ES 2.0 (${glVersion})`;
            }
            ret = stringToNewUTF8(glVersion);
            break;
          case 0x8B8C  :
            var glslVersion = GLctx.getParameter(0x8B8C  );

            var ver_re = /^WebGL GLSL ES ([0-9]\.[0-9][0-9]?)(?:$| .*)/;
            var ver_num = glslVersion.match(ver_re);
            if (ver_num !== null) {
              if (ver_num[1].length == 3) ver_num[1] = ver_num[1] + '0';
              glslVersion = `OpenGL ES GLSL ES ${ver_num[1]} (${glslVersion})`;
            }
            ret = stringToNewUTF8(glslVersion);
            break;
          default:
            GL.recordError(0x500 );

        }
        GL.stringCache[name_] = ret;
      }
      return ret;
    };

  var jstoi_q = (str) => parseInt(str);

  var webglGetLeftBracePos = (name) => name.slice(-1) == ']' && name.lastIndexOf('[');

  var webglPrepareUniformLocationsBeforeFirstUse = (program) => {
      var uniformLocsById = program.uniformLocsById,
        uniformSizeAndIdsByName = program.uniformSizeAndIdsByName,
        i, j;

      if (!uniformLocsById) {

        program.uniformLocsById = uniformLocsById = {};

        program.uniformArrayNamesById = {};

        for (i = 0; i < GLctx.getProgramParameter(program, 0x8B86 ); ++i) {
          var u = GLctx.getActiveUniform(program, i);
          var nm = u.name;
          var sz = u.size;
          var lb = webglGetLeftBracePos(nm);
          var arrayName = lb > 0 ? nm.slice(0, lb) : nm;

          var id = program.uniformIdCounter;
          program.uniformIdCounter += sz;

          uniformSizeAndIdsByName[arrayName] = [sz, id];

          for (j = 0; j < sz; ++j) {
            uniformLocsById[id] = j;
            program.uniformArrayNamesById[id++] = arrayName;
          }
        }
      }
    };

  var _glGetUniformLocation = (program, name) => {

      name = UTF8ToString(name);

      if (program = GL.programs[program]) {
        webglPrepareUniformLocationsBeforeFirstUse(program);
        var uniformLocsById = program.uniformLocsById;
        var arrayIndex = 0;
        var uniformBaseName = name;

        var leftBrace = webglGetLeftBracePos(name);

        if (leftBrace > 0) {
          arrayIndex = jstoi_q(name.slice(leftBrace + 1)) >>> 0;
          uniformBaseName = name.slice(0, leftBrace);
        }

        var sizeAndId = program.uniformSizeAndIdsByName[uniformBaseName];

        if (sizeAndId && arrayIndex < sizeAndId[0]) {
          arrayIndex += sizeAndId[1];
          if ((uniformLocsById[arrayIndex] = uniformLocsById[arrayIndex] || GLctx.getUniformLocation(program, name))) {
            return arrayIndex;
          }
        }
      }
      else {

        GL.recordError(0x501  );
      }
      return -1;
    };

  function _glLineWidth(x0) { GLctx.lineWidth(x0) }

  var _glLinkProgram = (program) => {
      program = GL.programs[program];
      GLctx.linkProgram(program);

      program.uniformLocsById = 0;
      program.uniformSizeAndIdsByName = {};

    };

  var _glPixelStorei = (pname, param) => {
      if (pname == 0xCF5  ) {
        GL.unpackAlignment = param;
      }
      GLctx.pixelStorei(pname, param);
    };

  function _glReadBuffer(x0) { GLctx.readBuffer(x0) }

  var computeUnpackAlignedImageSize = (width, height, sizePerPixel, alignment) => {
      function roundedToNextMultipleOf(x, y) {
        return (x + y - 1) & -y;
      }
      var plainRowSize = width * sizePerPixel;
      var alignedRowSize = roundedToNextMultipleOf(plainRowSize, alignment);
      return height * alignedRowSize;
    };

  var colorChannelsInGlTextureFormat = (format) => {

      var colorChannels = {

        5: 3,
        6: 4,

        8: 2,
        29502: 3,
        29504: 4,

        26917: 2,
        26918: 2,

        29846: 3,
        29847: 4
      };
      return colorChannels[format - 0x1902]||1;
    };

  var heapObjectForWebGLType = (type) => {

      type -= 0x1400;
      if (type == 0) return HEAP8;

      if (type == 1) return HEAPU8;

      if (type == 2) return HEAP16;

      if (type == 4) return HEAP32;

      if (type == 6) return HEAPF32;

      if (type == 5
        || type == 28922
        || type == 28520
        || type == 30779
        || type == 30782
        )
        return HEAPU32;

      return HEAPU16;
    };

  var heapAccessShiftForWebGLHeap = (heap) => 31 - Math.clz32(heap.BYTES_PER_ELEMENT);

  var emscriptenWebGLGetTexPixelData = (type, format, width, height, pixels, internalFormat) => {
      var heap = heapObjectForWebGLType(type);
      var shift = heapAccessShiftForWebGLHeap(heap);
      var byteSize = 1<<shift;
      var sizePerPixel = colorChannelsInGlTextureFormat(format) * byteSize;
      var bytes = computeUnpackAlignedImageSize(width, height, sizePerPixel, GL.unpackAlignment);
      return heap.subarray(pixels >> shift, pixels + bytes >> shift);
    };

  var _glReadPixels = (x, y, width, height, format, type, pixels) => {
      if (true) {

        if (GLctx.currentPixelPackBufferBinding) {
          GLctx.readPixels(x, y, width, height, format, type, pixels);
        } else {
          var heap = heapObjectForWebGLType(type);
          GLctx.readPixels(x, y, width, height, format, type, heap, pixels >> heapAccessShiftForWebGLHeap(heap));
        }
        return;
      }
      var pixelData = emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, format);
      if (!pixelData) {
        GL.recordError(0x500 );
        return;
      }
      GLctx.readPixels(x, y, width, height, format, type, pixelData);
    };

  var _glShaderSource = (shader, count, string, length) => {
      var source = GL.getSource(shader, count, string, length);

      GLctx.shaderSource(GL.shaders[shader], source);
    };

  var _glTexImage2D = (target, level, internalFormat, width, height, border, format, type, pixels) => {
      if (true) {

        if (GLctx.currentPixelUnpackBufferBinding) {
          GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, pixels);
        } else if (pixels) {
          var heap = heapObjectForWebGLType(type);
          GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, heap, pixels >> heapAccessShiftForWebGLHeap(heap));
        } else {
          GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, null);
        }
        return;
      }
      GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, pixels ? emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, internalFormat) : null);
    };

  function _glTexParameteri(x0, x1, x2) { GLctx.texParameteri(x0, x1, x2) }

  var _glTexSubImage2D = (target, level, xoffset, yoffset, width, height, format, type, pixels) => {
      if (true) {

        if (GLctx.currentPixelUnpackBufferBinding) {
          GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixels);
        } else if (pixels) {
          var heap = heapObjectForWebGLType(type);
          GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, heap, pixels >> heapAccessShiftForWebGLHeap(heap));
        } else {
          GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, null);
        }
        return;
      }
      var pixelData = null;
      if (pixels) pixelData = emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, 0);
      GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixelData);
    };

  var webglGetUniformLocation = (location) => {
      var p = GLctx.currentProgram;

      if (p) {
        var webglLoc = p.uniformLocsById[location];

        if (typeof webglLoc == 'number') {
          p.uniformLocsById[location] = webglLoc = GLctx.getUniformLocation(p, p.uniformArrayNamesById[location] + (webglLoc > 0 ? `[${webglLoc}]` : ''));
        }

        return webglLoc;
      } else {
        GL.recordError(0x502 );
      }
    };

  var _glUniform1f = (location, v0) => {
      GLctx.uniform1f(webglGetUniformLocation(location), v0);
    };

  var _glUniform1i = (location, v0) => {
      GLctx.uniform1i(webglGetUniformLocation(location), v0);
    };

  var _glUniform2f = (location, v0, v1) => {
      GLctx.uniform2f(webglGetUniformLocation(location), v0, v1);
    };

  var _glUniform3f = (location, v0, v1, v2) => {
      GLctx.uniform3f(webglGetUniformLocation(location), v0, v1, v2);
    };

  var _glUniform4f = (location, v0, v1, v2, v3) => {
      GLctx.uniform4f(webglGetUniformLocation(location), v0, v1, v2, v3);
    };

  var _glUniform4fv = (location, count, value) => {

      count && GLctx.uniform4fv(webglGetUniformLocation(location), HEAPF32, value>>2, count*4);
    };

  var _glUniformMatrix4fv = (location, count, transpose, value) => {

      count && GLctx.uniformMatrix4fv(webglGetUniformLocation(location), !!transpose, HEAPF32, value>>2, count*16);
    };

  var _glUseProgram = (program) => {
      program = GL.programs[program];
      GLctx.useProgram(program);

      GLctx.currentProgram = program;
    };

  var _glVertexAttribPointer = (index, size, type, normalized, stride, ptr) => {
      GLctx.vertexAttribPointer(index, size, type, !!normalized, stride, ptr);
    };

  function _glViewport(x0, x1, x2, x3) { GLctx.viewport(x0, x1, x2, x3) }

  var _llvm_eh_typeid_for = (type) => type;

  var arraySum = (array, index) => {
      var sum = 0;
      for (var i = 0; i <= index; sum += array[i++]) {

      }
      return sum;
    };

  var MONTH_DAYS_LEAP = [31,29,31,30,31,30,31,31,30,31,30,31];

  var MONTH_DAYS_REGULAR = [31,28,31,30,31,30,31,31,30,31,30,31];
  var addDays = (date, days) => {
      var newDate = new Date(date.getTime());
      while (days > 0) {
        var leap = isLeapYear(newDate.getFullYear());
        var currentMonth = newDate.getMonth();
        var daysInCurrentMonth = (leap ? MONTH_DAYS_LEAP : MONTH_DAYS_REGULAR)[currentMonth];

        if (days > daysInCurrentMonth-newDate.getDate()) {

          days -= (daysInCurrentMonth-newDate.getDate()+1);
          newDate.setDate(1);
          if (currentMonth < 11) {
            newDate.setMonth(currentMonth+1)
          } else {
            newDate.setMonth(0);
            newDate.setFullYear(newDate.getFullYear()+1);
          }
        } else {

          newDate.setDate(newDate.getDate()+days);
          return newDate;
        }
      }

      return newDate;
    };

  var writeArrayToMemory = (array, buffer) => {
      HEAP8.set(array, buffer);
    };

  var _strftime = (s, maxsize, format, tm) => {

      var tm_zone = HEAPU32[(((tm)+(40))>>2)];

      var date = {
        tm_sec: HEAP32[((tm)>>2)],
        tm_min: HEAP32[(((tm)+(4))>>2)],
        tm_hour: HEAP32[(((tm)+(8))>>2)],
        tm_mday: HEAP32[(((tm)+(12))>>2)],
        tm_mon: HEAP32[(((tm)+(16))>>2)],
        tm_year: HEAP32[(((tm)+(20))>>2)],
        tm_wday: HEAP32[(((tm)+(24))>>2)],
        tm_yday: HEAP32[(((tm)+(28))>>2)],
        tm_isdst: HEAP32[(((tm)+(32))>>2)],
        tm_gmtoff: HEAP32[(((tm)+(36))>>2)],
        tm_zone: tm_zone ? UTF8ToString(tm_zone) : ''
      };

      var pattern = UTF8ToString(format);

      var EXPANSION_RULES_1 = {
        '%c': '%a %b %d %H:%M:%S %Y',
        '%D': '%m/%d/%y',
        '%F': '%Y-%m-%d',
        '%h': '%b',
        '%r': '%I:%M:%S %p',
        '%R': '%H:%M',
        '%T': '%H:%M:%S',
        '%x': '%m/%d/%y',
        '%X': '%H:%M:%S',

        '%Ec': '%c',
        '%EC': '%C',
        '%Ex': '%m/%d/%y',
        '%EX': '%H:%M:%S',
        '%Ey': '%y',
        '%EY': '%Y',
        '%Od': '%d',
        '%Oe': '%e',
        '%OH': '%H',
        '%OI': '%I',
        '%Om': '%m',
        '%OM': '%M',
        '%OS': '%S',
        '%Ou': '%u',
        '%OU': '%U',
        '%OV': '%V',
        '%Ow': '%w',
        '%OW': '%W',
        '%Oy': '%y',
      };
      for (var rule in EXPANSION_RULES_1) {
        pattern = pattern.replace(new RegExp(rule, 'g'), EXPANSION_RULES_1[rule]);
      }

      var WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

      function leadingSomething(value, digits, character) {
        var str = typeof value == 'number' ? value.toString() : (value || '');
        while (str.length < digits) {
          str = character[0]+str;
        }
        return str;
      }

      function leadingNulls(value, digits) {
        return leadingSomething(value, digits, '0');
      }

      function compareByDay(date1, date2) {
        function sgn(value) {
          return value < 0 ? -1 : (value > 0 ? 1 : 0);
        }

        var compare;
        if ((compare = sgn(date1.getFullYear()-date2.getFullYear())) === 0) {
          if ((compare = sgn(date1.getMonth()-date2.getMonth())) === 0) {
            compare = sgn(date1.getDate()-date2.getDate());
          }
        }
        return compare;
      }

      function getFirstWeekStartDate(janFourth) {
          switch (janFourth.getDay()) {
            case 0:
              return new Date(janFourth.getFullYear()-1, 11, 29);
            case 1:
              return janFourth;
            case 2:
              return new Date(janFourth.getFullYear(), 0, 3);
            case 3:
              return new Date(janFourth.getFullYear(), 0, 2);
            case 4:
              return new Date(janFourth.getFullYear(), 0, 1);
            case 5:
              return new Date(janFourth.getFullYear()-1, 11, 31);
            case 6:
              return new Date(janFourth.getFullYear()-1, 11, 30);
          }
      }

      function getWeekBasedYear(date) {
          var thisDate = addDays(new Date(date.tm_year+1900, 0, 1), date.tm_yday);

          var janFourthThisYear = new Date(thisDate.getFullYear(), 0, 4);
          var janFourthNextYear = new Date(thisDate.getFullYear()+1, 0, 4);

          var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
          var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);

          if (compareByDay(firstWeekStartThisYear, thisDate) <= 0) {

            if (compareByDay(firstWeekStartNextYear, thisDate) <= 0) {
              return thisDate.getFullYear()+1;
            }
            return thisDate.getFullYear();
          }
          return thisDate.getFullYear()-1;
      }

      var EXPANSION_RULES_2 = {
        '%a': (date) => WEEKDAYS[date.tm_wday].substring(0,3) ,
        '%A': (date) => WEEKDAYS[date.tm_wday],
        '%b': (date) => MONTHS[date.tm_mon].substring(0,3),
        '%B': (date) => MONTHS[date.tm_mon],
        '%C': (date) => {
          var year = date.tm_year+1900;
          return leadingNulls((year/100)|0,2);
        },
        '%d': (date) => leadingNulls(date.tm_mday, 2),
        '%e': (date) => leadingSomething(date.tm_mday, 2, ' '),
        '%g': (date) => {

          return getWeekBasedYear(date).toString().substring(2);
        },
        '%G': (date) => getWeekBasedYear(date),
        '%H': (date) => leadingNulls(date.tm_hour, 2),
        '%I': (date) => {
          var twelveHour = date.tm_hour;
          if (twelveHour == 0) twelveHour = 12;
          else if (twelveHour > 12) twelveHour -= 12;
          return leadingNulls(twelveHour, 2);
        },
        '%j': (date) => {

          return leadingNulls(date.tm_mday + arraySum(isLeapYear(date.tm_year+1900) ? MONTH_DAYS_LEAP : MONTH_DAYS_REGULAR, date.tm_mon-1), 3);
        },
        '%m': (date) => leadingNulls(date.tm_mon+1, 2),
        '%M': (date) => leadingNulls(date.tm_min, 2),
        '%n': () => '\n',
        '%p': (date) => {
          if (date.tm_hour >= 0 && date.tm_hour < 12) {
            return 'AM';
          }
          return 'PM';
        },
        '%S': (date) => leadingNulls(date.tm_sec, 2),
        '%t': () => '\t',
        '%u': (date) => date.tm_wday || 7,
        '%U': (date) => {
          var days = date.tm_yday + 7 - date.tm_wday;
          return leadingNulls(Math.floor(days / 7), 2);
        },
        '%V': (date) => {

          var val = Math.floor((date.tm_yday + 7 - (date.tm_wday + 6) % 7 ) / 7);

          if ((date.tm_wday + 371 - date.tm_yday - 2) % 7 <= 2) {
            val++;
          }
          if (!val) {
            val = 52;

            var dec31 = (date.tm_wday + 7 - date.tm_yday - 1) % 7;
            if (dec31 == 4 || (dec31 == 5 && isLeapYear(date.tm_year%400-1))) {
              val++;
            }
          } else if (val == 53) {

            var jan1 = (date.tm_wday + 371 - date.tm_yday) % 7;
            if (jan1 != 4 && (jan1 != 3 || !isLeapYear(date.tm_year)))
              val = 1;
          }
          return leadingNulls(val, 2);
        },
        '%w': (date) => date.tm_wday,
        '%W': (date) => {
          var days = date.tm_yday + 7 - ((date.tm_wday + 6) % 7);
          return leadingNulls(Math.floor(days / 7), 2);
        },
        '%y': (date) => {

          return (date.tm_year+1900).toString().substring(2);
        },

        '%Y': (date) => date.tm_year+1900,
        '%z': (date) => {

          var off = date.tm_gmtoff;
          var ahead = off >= 0;
          off = Math.abs(off) / 60;

          off = (off / 60)*100 + (off % 60);
          return (ahead ? '+' : '-') + String("0000" + off).slice(-4);
        },
        '%Z': (date) => date.tm_zone,
        '%%': () => '%'
      };

      pattern = pattern.replace(/%%/g, '\0\0')
      for (var rule in EXPANSION_RULES_2) {
        if (pattern.includes(rule)) {
          pattern = pattern.replace(new RegExp(rule, 'g'), EXPANSION_RULES_2[rule](date));
        }
      }
      pattern = pattern.replace(/\0\0/g, '%')

      var bytes = intArrayFromString(pattern, false);
      if (bytes.length > maxsize) {
        return 0;
      }

      writeArrayToMemory(bytes, s);
      return bytes.length-1;
    };
  var _strftime_l = (s, maxsize, format, tm, loc) => {
      return _strftime(s, maxsize, format, tm);
    };

  var getCFunc = (ident) => {
      var func = Module['_' + ident];
      return func;
    };

  var stringToUTF8OnStack = (str) => {
      var size = lengthBytesUTF8(str) + 1;
      var ret = stackAlloc(size);
      stringToUTF8(str, ret, size);
      return ret;
    };

  var ccall = (ident, returnType, argTypes, args, opts) => {

      var toC = {
        'string': (str) => {
          var ret = 0;
          if (str !== null && str !== undefined && str !== 0) {

            ret = stringToUTF8OnStack(str);
          }
          return ret;
        },
        'array': (arr) => {
          var ret = stackAlloc(arr.length);
          writeArrayToMemory(arr, ret);
          return ret;
        }
      };

      function convertReturnValue(ret) {
        if (returnType === 'string') {

          return UTF8ToString(ret);
        }
        if (returnType === 'boolean') return Boolean(ret);
        return ret;
      }

      var func = getCFunc(ident);
      var cArgs = [];
      var stack = 0;
      if (args) {
        for (var i = 0; i < args.length; i++) {
          var converter = toC[argTypes[i]];
          if (converter) {
            if (stack === 0) stack = stackSave();
            cArgs[i] = converter(args[i]);
          } else {
            cArgs[i] = args[i];
          }
        }
      }
      var ret = func.apply(null, cArgs);
      function onDone(ret) {
        if (stack !== 0) stackRestore(stack);
        return convertReturnValue(ret);
      }

      ret = onDone(ret);
      return ret;
    };

  var FS_unlink = (path) => FS.unlink(path);

  var FSNode =   function(parent, name, mode, rdev) {
    if (!parent) {
      parent = this;
    }
    this.parent = parent;
    this.mount = parent.mount;
    this.mounted = null;
    this.id = FS.nextInode++;
    this.name = name;
    this.mode = mode;
    this.node_ops = {};
    this.stream_ops = {};
    this.rdev = rdev;
  };
  var readMode = 292  | 73 ;
  var writeMode = 146 ;
  Object.defineProperties(FSNode.prototype, {
   read: {
    get:  function() {
     return (this.mode & readMode) === readMode;
    },
    set:  function(val) {
     val ? this.mode |= readMode : this.mode &= ~readMode;
    }
   },
   write: {
    get:  function() {
     return (this.mode & writeMode) === writeMode;
    },
    set:  function(val) {
     val ? this.mode |= writeMode : this.mode &= ~writeMode;
    }
   },
   isFolder: {
    get:  function() {
     return FS.isDir(this.mode);
    }
   },
   isDevice: {
    get:  function() {
     return FS.isChrdev(this.mode);
    }
   }
  });
  FS.FSNode = FSNode;
  FS.createPreloadedFile = FS_createPreloadedFile;
  FS.staticInit();Module["FS_createPath"] = FS.createPath;Module["FS_createDataFile"] = FS.createDataFile;Module["FS_createPreloadedFile"] = FS.createPreloadedFile;Module["FS_unlink"] = FS.unlink;Module["FS_createLazyFile"] = FS.createLazyFile;Module["FS_createDevice"] = FS.createDevice;;

      Module["requestFullscreen"] = Browser.requestFullscreen;
      Module["requestAnimationFrame"] = Browser.requestAnimationFrame;
      Module["setCanvasSize"] = Browser.setCanvasSize;
      Module["pauseMainLoop"] = Browser.mainLoop.pause;
      Module["resumeMainLoop"] = Browser.mainLoop.resume;
      Module["getUserMedia"] = Browser.getUserMedia;
      Module["createContext"] = Browser.createContext;
      var preloadedImages = {};
      var preloadedAudios = {};;
var GLctx;;
var wasmImports = {

  __cxa_begin_catch: ___cxa_begin_catch,

  __cxa_end_catch: ___cxa_end_catch,

  __cxa_find_matching_catch_2: ___cxa_find_matching_catch_2,

  __cxa_find_matching_catch_3: ___cxa_find_matching_catch_3,

  __cxa_find_matching_catch_5: ___cxa_find_matching_catch_5,

  __cxa_rethrow: ___cxa_rethrow,

  __cxa_throw: ___cxa_throw,

  __cxa_uncaught_exceptions: ___cxa_uncaught_exceptions,

  __resumeException: ___resumeException,

  __syscall_fcntl64: ___syscall_fcntl64,

  __syscall_fstat64: ___syscall_fstat64,

  __syscall_getcwd: ___syscall_getcwd,

  __syscall_getdents64: ___syscall_getdents64,

  __syscall_ioctl: ___syscall_ioctl,

  __syscall_lstat64: ___syscall_lstat64,

  __syscall_mkdirat: ___syscall_mkdirat,

  __syscall_newfstatat: ___syscall_newfstatat,

  __syscall_openat: ___syscall_openat,

  __syscall_readlinkat: ___syscall_readlinkat,

  __syscall_stat64: ___syscall_stat64,

  _emscripten_get_now_is_monotonic: __emscripten_get_now_is_monotonic,

  _emscripten_throw_longjmp: __emscripten_throw_longjmp,

  _localtime_js: __localtime_js,

  _tzset_js: __tzset_js,

  abort: _abort,

  emscripten_asm_const_int: _emscripten_asm_const_int,

  emscripten_async_call: _emscripten_async_call,

  emscripten_cancel_main_loop: _emscripten_cancel_main_loop,

  emscripten_date_now: _emscripten_date_now,

  emscripten_get_device_pixel_ratio: _emscripten_get_device_pixel_ratio,

  emscripten_get_element_css_size: _emscripten_get_element_css_size,

  emscripten_get_heap_max: _emscripten_get_heap_max,

  emscripten_get_now: _emscripten_get_now,

  emscripten_memcpy_js: _emscripten_memcpy_js,

  emscripten_resize_heap: _emscripten_resize_heap,

  emscripten_set_canvas_element_size: _emscripten_set_canvas_element_size,

  emscripten_set_main_loop: _emscripten_set_main_loop,

  emscripten_set_mousedown_callback_on_thread: _emscripten_set_mousedown_callback_on_thread,

  emscripten_set_mouseleave_callback_on_thread: _emscripten_set_mouseleave_callback_on_thread,

  emscripten_set_mousemove_callback_on_thread: _emscripten_set_mousemove_callback_on_thread,

  emscripten_set_mouseup_callback_on_thread: _emscripten_set_mouseup_callback_on_thread,

  emscripten_set_wheel_callback_on_thread: _emscripten_set_wheel_callback_on_thread,

  emscripten_webgl_create_context: _emscripten_webgl_create_context,

  emscripten_webgl_enable_extension: _emscripten_webgl_enable_extension,

  emscripten_webgl_init_context_attributes: _emscripten_webgl_init_context_attributes,

  emscripten_webgl_make_context_current: _emscripten_webgl_make_context_current,

  environ_get: _environ_get,

  environ_sizes_get: _environ_sizes_get,

  fd_close: _fd_close,

  fd_read: _fd_read,

  fd_seek: _fd_seek,

  fd_write: _fd_write,

  glActiveTexture: _glActiveTexture,

  glAttachShader: _glAttachShader,

  glBindAttribLocation: _glBindAttribLocation,

  glBindBuffer: _glBindBuffer,

  glBindTexture: _glBindTexture,

  glBindVertexArray: _glBindVertexArray,

  glBlendEquation: _glBlendEquation,

  glBlendFunc: _glBlendFunc,

  glBufferData: _glBufferData,

  glBufferSubData: _glBufferSubData,

  glClear: _glClear,

  glClearColor: _glClearColor,

  glCompileShader: _glCompileShader,

  glCreateProgram: _glCreateProgram,

  glCreateShader: _glCreateShader,

  glDeleteBuffers: _glDeleteBuffers,

  glDeleteProgram: _glDeleteProgram,

  glDeleteShader: _glDeleteShader,

  glDeleteTextures: _glDeleteTextures,

  glDeleteVertexArrays: _glDeleteVertexArrays,

  glDepthFunc: _glDepthFunc,

  glDepthMask: _glDepthMask,

  glDisable: _glDisable,

  glDrawArrays: _glDrawArrays,

  glDrawElements: _glDrawElements,

  glEnable: _glEnable,

  glEnableVertexAttribArray: _glEnableVertexAttribArray,

  glFinish: _glFinish,

  glGenBuffers: _glGenBuffers,

  glGenTextures: _glGenTextures,

  glGenVertexArrays: _glGenVertexArrays,

  glGetActiveAttrib: _glGetActiveAttrib,

  glGetActiveUniform: _glGetActiveUniform,

  glGetError: _glGetError,

  glGetIntegerv: _glGetIntegerv,

  glGetProgramInfoLog: _glGetProgramInfoLog,

  glGetProgramiv: _glGetProgramiv,

  glGetShaderInfoLog: _glGetShaderInfoLog,

  glGetShaderiv: _glGetShaderiv,

  glGetString: _glGetString,

  glGetUniformLocation: _glGetUniformLocation,

  glLineWidth: _glLineWidth,

  glLinkProgram: _glLinkProgram,

  glPixelStorei: _glPixelStorei,

  glReadBuffer: _glReadBuffer,

  glReadPixels: _glReadPixels,

  glShaderSource: _glShaderSource,

  glTexImage2D: _glTexImage2D,

  glTexParameteri: _glTexParameteri,

  glTexSubImage2D: _glTexSubImage2D,

  glUniform1f: _glUniform1f,

  glUniform1i: _glUniform1i,

  glUniform2f: _glUniform2f,

  glUniform3f: _glUniform3f,

  glUniform4f: _glUniform4f,

  glUniform4fv: _glUniform4fv,

  glUniformMatrix4fv: _glUniformMatrix4fv,

  glUseProgram: _glUseProgram,

  glVertexAttribPointer: _glVertexAttribPointer,

  glViewport: _glViewport,

  invoke_d: invoke_d,

  invoke_dii: invoke_dii,

  invoke_diii: invoke_diii,

  invoke_ff: invoke_ff,

  invoke_fff: invoke_fff,

  invoke_fi: invoke_fi,

  invoke_fii: invoke_fii,

  invoke_fiii: invoke_fiii,

  invoke_i: invoke_i,

  invoke_ii: invoke_ii,

  invoke_iid: invoke_iid,

  invoke_iif: invoke_iif,

  invoke_iiffiiiii: invoke_iiffiiiii,

  invoke_iifiifffffi: invoke_iifiifffffi,

  invoke_iii: invoke_iii,

  invoke_iiif: invoke_iiif,

  invoke_iiififi: invoke_iiififi,

  invoke_iiii: invoke_iiii,

  invoke_iiiif: invoke_iiiif,

  invoke_iiiiff: invoke_iiiiff,

  invoke_iiiififi: invoke_iiiififi,

  invoke_iiiii: invoke_iiiii,

  invoke_iiiiid: invoke_iiiiid,

  invoke_iiiiiff: invoke_iiiiiff,

  invoke_iiiiifffffffffffiiififffffffffffiffffiffii: invoke_iiiiifffffffffffiiififffffffffffiffffiffii,

  invoke_iiiiii: invoke_iiiiii,

  invoke_iiiiiifffffffi: invoke_iiiiiifffffffi,

  invoke_iiiiiii: invoke_iiiiiii,

  invoke_iiiiiiii: invoke_iiiiiiii,

  invoke_iiiiiiiii: invoke_iiiiiiiii,

  invoke_iiiiiiiiii: invoke_iiiiiiiiii,

  invoke_iiiiiiiiiii: invoke_iiiiiiiiiii,

  invoke_iiiiiiiiiiii: invoke_iiiiiiiiiiii,

  invoke_iiiiiiiiiiiii: invoke_iiiiiiiiiiiii,

  invoke_iiiiiiiiiiiiiiff: invoke_iiiiiiiiiiiiiiff,

  invoke_iiiiij: invoke_iiiiij,

  invoke_iij: invoke_iij,

  invoke_iiji: invoke_iiji,

  invoke_j: invoke_j,

  invoke_ji: invoke_ji,

  invoke_jii: invoke_jii,

  invoke_jiii: invoke_jiii,

  invoke_jiiii: invoke_jiiii,

  invoke_v: invoke_v,

  invoke_vi: invoke_vi,

  invoke_vif: invoke_vif,

  invoke_viff: invoke_viff,

  invoke_vifff: invoke_vifff,

  invoke_vifffii: invoke_vifffii,

  invoke_viffifii: invoke_viffifii,

  invoke_viffii: invoke_viffii,

  invoke_viffiififii: invoke_viffiififii,

  invoke_viffiii: invoke_viffiii,

  invoke_vifi: invoke_vifi,

  invoke_vifii: invoke_vifii,

  invoke_vifiii: invoke_vifiii,

  invoke_vifiiii: invoke_vifiiii,

  invoke_vii: invoke_vii,

  invoke_viif: invoke_viif,

  invoke_viiffi: invoke_viiffi,

  invoke_viiffiiifiiiiff: invoke_viiffiiifiiiiff,

  invoke_viifi: invoke_viifi,

  invoke_viifif: invoke_viifif,

  invoke_viifj: invoke_viifj,

  invoke_viii: invoke_viii,

  invoke_viiif: invoke_viiif,

  invoke_viiiff: invoke_viiiff,

  invoke_viiiffii: invoke_viiiffii,

  invoke_viiifii: invoke_viiifii,

  invoke_viiii: invoke_viiii,

  invoke_viiiid: invoke_viiiid,

  invoke_viiiii: invoke_viiiii,

  invoke_viiiiif: invoke_viiiiif,

  invoke_viiiiii: invoke_viiiiii,

  invoke_viiiiiii: invoke_viiiiiii,

  invoke_viiiiiiii: invoke_viiiiiiii,

  invoke_viiiiiiiii: invoke_viiiiiiiii,

  invoke_viiiiiiiiii: invoke_viiiiiiiiii,

  invoke_viiiiiiiiiii: invoke_viiiiiiiiiii,

  invoke_viiiiiiiiiiii: invoke_viiiiiiiiiiii,

  invoke_viiiiiiiiiiiii: invoke_viiiiiiiiiiiii,

  invoke_viiiiiiiiiiiiii: invoke_viiiiiiiiiiiiii,

  invoke_viiiiiiiiiiiiiii: invoke_viiiiiiiiiiiiiii,

  invoke_viiiiiiiiiiiiiiiiiiiiiiii: invoke_viiiiiiiiiiiiiiiiiiiiiiii,

  invoke_viijii: invoke_viijii,

  invoke_vijfii: invoke_vijfii,

  invoke_vijfiiiffii: invoke_vijfiiiffii,

  llvm_eh_typeid_for: _llvm_eh_typeid_for,

  strftime_l: _strftime_l
};
var wasmExports = createWasm();
var ___wasm_call_ctors = () => (___wasm_call_ctors = wasmExports['__wasm_call_ctors'])();
var _fs_load_ship = Module['_fs_load_ship'] = (a0) => (_fs_load_ship = Module['_fs_load_ship'] = wasmExports['fs_load_ship'])(a0);
var _fs_set_tool = Module['_fs_set_tool'] = (a0) => (_fs_set_tool = Module['_fs_set_tool'] = wasmExports['fs_set_tool'])(a0);
var _fs_set_paused = Module['_fs_set_paused'] = (a0) => (_fs_set_paused = Module['_fs_set_paused'] = wasmExports['fs_set_paused'])(a0);
var _fs_is_paused = Module['_fs_is_paused'] = () => (_fs_is_paused = Module['_fs_is_paused'] = wasmExports['fs_is_paused'])();
var _fs_step = Module['_fs_step'] = () => (_fs_step = Module['_fs_step'] = wasmExports['fs_step'])();
var _fs_zoom = Module['_fs_zoom'] = (a0) => (_fs_zoom = Module['_fs_zoom'] = wasmExports['fs_zoom'])(a0);
var _fs_reset_view = Module['_fs_reset_view'] = () => (_fs_reset_view = Module['_fs_reset_view'] = wasmExports['fs_reset_view'])();
var _fs_focus_on_ships = Module['_fs_focus_on_ships'] = () => (_fs_focus_on_ships = Module['_fs_focus_on_ships'] = wasmExports['fs_focus_on_ships'])();
var _fs_toggle_day_night = Module['_fs_toggle_day_night'] = () => (_fs_toggle_day_night = Module['_fs_toggle_day_night'] = wasmExports['fs_toggle_day_night'])();
var _fs_detonate_rc_bombs = Module['_fs_detonate_rc_bombs'] = () => (_fs_detonate_rc_bombs = Module['_fs_detonate_rc_bombs'] = wasmExports['fs_detonate_rc_bombs'])();
var _fs_detonate_anti_matter_bombs = Module['_fs_detonate_anti_matter_bombs'] = () => (_fs_detonate_anti_matter_bombs = Module['_fs_detonate_anti_matter_bombs'] = wasmExports['fs_detonate_anti_matter_bombs'])();
var _fs_remove_all_pins = Module['_fs_remove_all_pins'] = () => (_fs_remove_all_pins = Module['_fs_remove_all_pins'] = wasmExports['fs_remove_all_pins'])();
var _fs_set_status_text = Module['_fs_set_status_text'] = (a0) => (_fs_set_status_text = Module['_fs_set_status_text'] = wasmExports['fs_set_status_text'])(a0);
var _fs_set_shift = Module['_fs_set_shift'] = (a0) => (_fs_set_shift = Module['_fs_set_shift'] = wasmExports['fs_set_shift'])(a0);
var ___cxa_free_exception = (a0) => (___cxa_free_exception = wasmExports['__cxa_free_exception'])(a0);
var _main = Module['_main'] = (a0, a1) => (_main = Module['_main'] = wasmExports['main'])(a0, a1);
var _free = (a0) => (_free = wasmExports['free'])(a0);
var _malloc = (a0) => (_malloc = wasmExports['malloc'])(a0);
var setTempRet0 = (a0) => (setTempRet0 = wasmExports['setTempRet0'])(a0);
var ___errno_location = () => (___errno_location = wasmExports['__errno_location'])();
var _setThrew = (a0, a1) => (_setThrew = wasmExports['setThrew'])(a0, a1);
var stackSave = () => (stackSave = wasmExports['stackSave'])();
var stackRestore = (a0) => (stackRestore = wasmExports['stackRestore'])(a0);
var stackAlloc = (a0) => (stackAlloc = wasmExports['stackAlloc'])(a0);
var ___cxa_decrement_exception_refcount = (a0) => (___cxa_decrement_exception_refcount = wasmExports['__cxa_decrement_exception_refcount'])(a0);
var ___cxa_increment_exception_refcount = (a0) => (___cxa_increment_exception_refcount = wasmExports['__cxa_increment_exception_refcount'])(a0);
var ___cxa_can_catch = (a0, a1, a2) => (___cxa_can_catch = wasmExports['__cxa_can_catch'])(a0, a1, a2);
var ___cxa_is_pointer_type = (a0) => (___cxa_is_pointer_type = wasmExports['__cxa_is_pointer_type'])(a0);
var dynCall_j = Module['dynCall_j'] = (a0) => (dynCall_j = Module['dynCall_j'] = wasmExports['dynCall_j'])(a0);
var dynCall_iij = Module['dynCall_iij'] = (a0, a1, a2, a3) => (dynCall_iij = Module['dynCall_iij'] = wasmExports['dynCall_iij'])(a0, a1, a2, a3);
var dynCall_iiijf = Module['dynCall_iiijf'] = (a0, a1, a2, a3, a4, a5) => (dynCall_iiijf = Module['dynCall_iiijf'] = wasmExports['dynCall_iiijf'])(a0, a1, a2, a3, a4, a5);
var dynCall_viifj = Module['dynCall_viifj'] = (a0, a1, a2, a3, a4, a5) => (dynCall_viifj = Module['dynCall_viifj'] = wasmExports['dynCall_viifj'])(a0, a1, a2, a3, a4, a5);
var dynCall_ji = Module['dynCall_ji'] = (a0, a1) => (dynCall_ji = Module['dynCall_ji'] = wasmExports['dynCall_ji'])(a0, a1);
var dynCall_vij = Module['dynCall_vij'] = (a0, a1, a2, a3) => (dynCall_vij = Module['dynCall_vij'] = wasmExports['dynCall_vij'])(a0, a1, a2, a3);
var dynCall_jiii = Module['dynCall_jiii'] = (a0, a1, a2, a3) => (dynCall_jiii = Module['dynCall_jiii'] = wasmExports['dynCall_jiii'])(a0, a1, a2, a3);
var dynCall_jii = Module['dynCall_jii'] = (a0, a1, a2) => (dynCall_jii = Module['dynCall_jii'] = wasmExports['dynCall_jii'])(a0, a1, a2);
var dynCall_iijfii = Module['dynCall_iijfii'] = (a0, a1, a2, a3, a4, a5, a6) => (dynCall_iijfii = Module['dynCall_iijfii'] = wasmExports['dynCall_iijfii'])(a0, a1, a2, a3, a4, a5, a6);
var dynCall_vijfii = Module['dynCall_vijfii'] = (a0, a1, a2, a3, a4, a5, a6) => (dynCall_vijfii = Module['dynCall_vijfii'] = wasmExports['dynCall_vijfii'])(a0, a1, a2, a3, a4, a5, a6);
var dynCall_vijfiiiffii = Module['dynCall_vijfiiiffii'] = (a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11) => (dynCall_vijfiiiffii = Module['dynCall_vijfiiiffii'] = wasmExports['dynCall_vijfiiiffii'])(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11);
var dynCall_iiji = Module['dynCall_iiji'] = (a0, a1, a2, a3, a4) => (dynCall_iiji = Module['dynCall_iiji'] = wasmExports['dynCall_iiji'])(a0, a1, a2, a3, a4);
var dynCall_jiji = Module['dynCall_jiji'] = (a0, a1, a2, a3, a4) => (dynCall_jiji = Module['dynCall_jiji'] = wasmExports['dynCall_jiji'])(a0, a1, a2, a3, a4);
var dynCall_viijii = Module['dynCall_viijii'] = (a0, a1, a2, a3, a4, a5, a6) => (dynCall_viijii = Module['dynCall_viijii'] = wasmExports['dynCall_viijii'])(a0, a1, a2, a3, a4, a5, a6);
var dynCall_iiiiij = Module['dynCall_iiiiij'] = (a0, a1, a2, a3, a4, a5, a6) => (dynCall_iiiiij = Module['dynCall_iiiiij'] = wasmExports['dynCall_iiiiij'])(a0, a1, a2, a3, a4, a5, a6);
var dynCall_jiiii = Module['dynCall_jiiii'] = (a0, a1, a2, a3, a4) => (dynCall_jiiii = Module['dynCall_jiiii'] = wasmExports['dynCall_jiiii'])(a0, a1, a2, a3, a4);
var dynCall_iiiiijj = Module['dynCall_iiiiijj'] = (a0, a1, a2, a3, a4, a5, a6, a7, a8) => (dynCall_iiiiijj = Module['dynCall_iiiiijj'] = wasmExports['dynCall_iiiiijj'])(a0, a1, a2, a3, a4, a5, a6, a7, a8);
var dynCall_iiiiiijj = Module['dynCall_iiiiiijj'] = (a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) => (dynCall_iiiiiijj = Module['dynCall_iiiiiijj'] = wasmExports['dynCall_iiiiiijj'])(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9);

function invoke_v(index) {
  var sp = stackSave();
  try {
    getWasmTableEntry(index)();
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_iiii(index,a1,a2,a3) {
  var sp = stackSave();
  try {
    return getWasmTableEntry(index)(a1,a2,a3);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_viii(index,a1,a2,a3) {
  var sp = stackSave();
  try {
    getWasmTableEntry(index)(a1,a2,a3);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_viiii(index,a1,a2,a3,a4) {
  var sp = stackSave();
  try {
    getWasmTableEntry(index)(a1,a2,a3,a4);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_iii(index,a1,a2) {
  var sp = stackSave();
  try {
    return getWasmTableEntry(index)(a1,a2);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_vii(index,a1,a2) {
  var sp = stackSave();
  try {
    getWasmTableEntry(index)(a1,a2);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_vif(index,a1,a2) {
  var sp = stackSave();
  try {
    getWasmTableEntry(index)(a1,a2);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_vi(index,a1) {
  var sp = stackSave();
  try {
    getWasmTableEntry(index)(a1);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_ii(index,a1) {
  var sp = stackSave();
  try {
    return getWasmTableEntry(index)(a1);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_d(index) {
  var sp = stackSave();
  try {
    return getWasmTableEntry(index)();
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_iiiiii(index,a1,a2,a3,a4,a5) {
  var sp = stackSave();
  try {
    return getWasmTableEntry(index)(a1,a2,a3,a4,a5);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_iiiii(index,a1,a2,a3,a4) {
  var sp = stackSave();
  try {
    return getWasmTableEntry(index)(a1,a2,a3,a4);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_viif(index,a1,a2,a3) {
  var sp = stackSave();
  try {
    getWasmTableEntry(index)(a1,a2,a3);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_viifi(index,a1,a2,a3,a4) {
  var sp = stackSave();
  try {
    getWasmTableEntry(index)(a1,a2,a3,a4);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_iiif(index,a1,a2,a3) {
  var sp = stackSave();
  try {
    return getWasmTableEntry(index)(a1,a2,a3);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_viiif(index,a1,a2,a3,a4) {
  var sp = stackSave();
  try {
    getWasmTableEntry(index)(a1,a2,a3,a4);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_viifif(index,a1,a2,a3,a4,a5) {
  var sp = stackSave();
  try {
    getWasmTableEntry(index)(a1,a2,a3,a4,a5);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_viiiii(index,a1,a2,a3,a4,a5) {
  var sp = stackSave();
  try {
    getWasmTableEntry(index)(a1,a2,a3,a4,a5);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_iiiiiii(index,a1,a2,a3,a4,a5,a6) {
  var sp = stackSave();
  try {
    return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_iiiiiiii(index,a1,a2,a3,a4,a5,a6,a7) {
  var sp = stackSave();
  try {
    return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_iiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8) {
  var sp = stackSave();
  try {
    return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_iiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9) {
  var sp = stackSave();
  try {
    return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_fff(index,a1,a2) {
  var sp = stackSave();
  try {
    return getWasmTableEntry(index)(a1,a2);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_viiiff(index,a1,a2,a3,a4,a5) {
  var sp = stackSave();
  try {
    getWasmTableEntry(index)(a1,a2,a3,a4,a5);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_iif(index,a1,a2) {
  var sp = stackSave();
  try {
    return getWasmTableEntry(index)(a1,a2);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_viiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11) {
  var sp = stackSave();
  try {
    getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_viiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8) {
  var sp = stackSave();
  try {
    getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_viff(index,a1,a2,a3) {
  var sp = stackSave();
  try {
    getWasmTableEntry(index)(a1,a2,a3);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_viffiififii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10) {
  var sp = stackSave();
  try {
    getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_iiffiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8) {
  var sp = stackSave();
  try {
    return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_viiiiii(index,a1,a2,a3,a4,a5,a6) {
  var sp = stackSave();
  try {
    getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_iiiiff(index,a1,a2,a3,a4,a5) {
  var sp = stackSave();
  try {
    return getWasmTableEntry(index)(a1,a2,a3,a4,a5);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_iiiiiff(index,a1,a2,a3,a4,a5,a6) {
  var sp = stackSave();
  try {
    return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_fi(index,a1) {
  var sp = stackSave();
  try {
    return getWasmTableEntry(index)(a1);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_viiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10) {
  var sp = stackSave();
  try {
    getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_dii(index,a1,a2) {
  var sp = stackSave();
  try {
    return getWasmTableEntry(index)(a1,a2);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_diii(index,a1,a2,a3) {
  var sp = stackSave();
  try {
    return getWasmTableEntry(index)(a1,a2,a3);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_viiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9) {
  var sp = stackSave();
  try {
    getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_i(index) {
  var sp = stackSave();
  try {
    return getWasmTableEntry(index)();
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_viiiiiii(index,a1,a2,a3,a4,a5,a6,a7) {
  var sp = stackSave();
  try {
    getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_iiiif(index,a1,a2,a3,a4) {
  var sp = stackSave();
  try {
    return getWasmTableEntry(index)(a1,a2,a3,a4);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_viiifii(index,a1,a2,a3,a4,a5,a6) {
  var sp = stackSave();
  try {
    getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_iiiiiiiiiiiiiiff(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15) {
  var sp = stackSave();
  try {
    return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_vifff(index,a1,a2,a3,a4) {
  var sp = stackSave();
  try {
    getWasmTableEntry(index)(a1,a2,a3,a4);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_iiiiiifffffffi(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13) {
  var sp = stackSave();
  try {
    return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_viiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13) {
  var sp = stackSave();
  try {
    getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_iiiiifffffffffffiiififffffffffffiffffiffii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24,a25,a26,a27,a28,a29,a30,a31,a32,a33,a34,a35,a36,a37,a38,a39,a40,a41) {
  var sp = stackSave();
  try {
    return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24,a25,a26,a27,a28,a29,a30,a31,a32,a33,a34,a35,a36,a37,a38,a39,a40,a41);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_viiiiif(index,a1,a2,a3,a4,a5,a6) {
  var sp = stackSave();
  try {
    getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_vifiii(index,a1,a2,a3,a4,a5) {
  var sp = stackSave();
  try {
    getWasmTableEntry(index)(a1,a2,a3,a4,a5);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_vifffii(index,a1,a2,a3,a4,a5,a6) {
  var sp = stackSave();
  try {
    getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_vifi(index,a1,a2,a3) {
  var sp = stackSave();
  try {
    getWasmTableEntry(index)(a1,a2,a3);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_viiiffii(index,a1,a2,a3,a4,a5,a6,a7) {
  var sp = stackSave();
  try {
    getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_viffiii(index,a1,a2,a3,a4,a5,a6) {
  var sp = stackSave();
  try {
    getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_viffifii(index,a1,a2,a3,a4,a5,a6,a7) {
  var sp = stackSave();
  try {
    getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_iifiifffffi(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10) {
  var sp = stackSave();
  try {
    return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_viiffi(index,a1,a2,a3,a4,a5) {
  var sp = stackSave();
  try {
    getWasmTableEntry(index)(a1,a2,a3,a4,a5);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_viiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12) {
  var sp = stackSave();
  try {
    getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_fii(index,a1,a2) {
  var sp = stackSave();
  try {
    return getWasmTableEntry(index)(a1,a2);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_viffii(index,a1,a2,a3,a4,a5) {
  var sp = stackSave();
  try {
    getWasmTableEntry(index)(a1,a2,a3,a4,a5);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_vifii(index,a1,a2,a3,a4) {
  var sp = stackSave();
  try {
    getWasmTableEntry(index)(a1,a2,a3,a4);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_vifiiii(index,a1,a2,a3,a4,a5,a6) {
  var sp = stackSave();
  try {
    getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_iiiififi(index,a1,a2,a3,a4,a5,a6,a7) {
  var sp = stackSave();
  try {
    return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_iiififi(index,a1,a2,a3,a4,a5,a6) {
  var sp = stackSave();
  try {
    return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_viiiiiiiiiiiiiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24) {
  var sp = stackSave();
  try {
    getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_iiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12) {
  var sp = stackSave();
  try {
    return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_viiffiiifiiiiff(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14) {
  var sp = stackSave();
  try {
    getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_viiiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14) {
  var sp = stackSave();
  try {
    getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_ff(index,a1) {
  var sp = stackSave();
  try {
    return getWasmTableEntry(index)(a1);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_viiiid(index,a1,a2,a3,a4,a5) {
  var sp = stackSave();
  try {
    getWasmTableEntry(index)(a1,a2,a3,a4,a5);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_iid(index,a1,a2) {
  var sp = stackSave();
  try {
    return getWasmTableEntry(index)(a1,a2);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_iiiiid(index,a1,a2,a3,a4,a5) {
  var sp = stackSave();
  try {
    return getWasmTableEntry(index)(a1,a2,a3,a4,a5);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_iiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10) {
  var sp = stackSave();
  try {
    return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_fiii(index,a1,a2,a3) {
  var sp = stackSave();
  try {
    return getWasmTableEntry(index)(a1,a2,a3);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_iiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11) {
  var sp = stackSave();
  try {
    return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_viiiiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15) {
  var sp = stackSave();
  try {
    getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_viifj(index,a1,a2,a3,a4,a5) {
  var sp = stackSave();
  try {
    dynCall_viifj(index,a1,a2,a3,a4,a5);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_j(index) {
  var sp = stackSave();
  try {
    return dynCall_j(index);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_iij(index,a1,a2,a3) {
  var sp = stackSave();
  try {
    return dynCall_iij(index,a1,a2,a3);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_ji(index,a1) {
  var sp = stackSave();
  try {
    return dynCall_ji(index,a1);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_jiii(index,a1,a2,a3) {
  var sp = stackSave();
  try {
    return dynCall_jiii(index,a1,a2,a3);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_jii(index,a1,a2) {
  var sp = stackSave();
  try {
    return dynCall_jii(index,a1,a2);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_vijfii(index,a1,a2,a3,a4,a5,a6) {
  var sp = stackSave();
  try {
    dynCall_vijfii(index,a1,a2,a3,a4,a5,a6);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_vijfiiiffii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11) {
  var sp = stackSave();
  try {
    dynCall_vijfiiiffii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_iiji(index,a1,a2,a3,a4) {
  var sp = stackSave();
  try {
    return dynCall_iiji(index,a1,a2,a3,a4);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_viijii(index,a1,a2,a3,a4,a5,a6) {
  var sp = stackSave();
  try {
    dynCall_viijii(index,a1,a2,a3,a4,a5,a6);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_iiiiij(index,a1,a2,a3,a4,a5,a6) {
  var sp = stackSave();
  try {
    return dynCall_iiiiij(index,a1,a2,a3,a4,a5,a6);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_jiiii(index,a1,a2,a3,a4) {
  var sp = stackSave();
  try {
    return dynCall_jiiii(index,a1,a2,a3,a4);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0) throw e;
    _setThrew(1, 0);
  }
}

Module['addRunDependency'] = addRunDependency;
Module['removeRunDependency'] = removeRunDependency;
Module['FS_createPath'] = FS.createPath;
Module['FS_createLazyFile'] = FS.createLazyFile;
Module['FS_createDevice'] = FS.createDevice;
Module['ccall'] = ccall;
Module['FS_createPreloadedFile'] = FS.createPreloadedFile;
Module['FS'] = FS;
Module['FS_createDataFile'] = FS.createDataFile;
Module['FS_unlink'] = FS.unlink;

var calledRun;

dependenciesFulfilled = function runCaller() {

  if (!calledRun) run();
  if (!calledRun) dependenciesFulfilled = runCaller;
};

function callMain() {

  var entryFunction = _main;

  var argc = 0;
  var argv = 0;

  try {

    var ret = entryFunction(argc, argv);

    exitJS(ret,   true);
    return ret;
  }
  catch (e) {
    return handleException(e);
  }
}

function run() {

  if (runDependencies > 0) {
    return;
  }

  preRun();

  if (runDependencies > 0) {
    return;
  }

  function doRun() {

    if (calledRun) return;
    calledRun = true;
    Module['calledRun'] = true;

    if (ABORT) return;

    initRuntime();

    preMain();

    if (Module['onRuntimeInitialized']) Module['onRuntimeInitialized']();

    if (shouldRunNow) callMain();

    postRun();
  }

  if (Module['setStatus']) {
    Module['setStatus']('Running...');
    setTimeout(function() {
      setTimeout(function() {
        Module['setStatus']('');
      }, 1);
      doRun();
    }, 1);
  } else
  {
    doRun();
  }
}

if (Module['preInit']) {
  if (typeof Module['preInit'] == 'function') Module['preInit'] = [Module['preInit']];
  while (Module['preInit'].length > 0) {
    Module['preInit'].pop()();
  }
}

var shouldRunNow = true;

if (Module['noInitialRun']) shouldRunNow = false;

run();

