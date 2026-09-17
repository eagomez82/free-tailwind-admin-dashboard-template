-- 1. Desactivar claves foráneas temporalmente para poder limpiar sin errores
PRAGMA foreign_keys = OFF;

-- 2. Limpieza total de la base de datos
DROP TABLE IF EXISTS movimientos;
DROP TABLE IF EXISTS inventario;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS categorias;

-- 3. Activar claves foráneas de nuevo
PRAGMA foreign_keys = ON;

-- 4. Creación de tablas (En orden lógico de padres a hijos)
CREATE TABLE categorias (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  descripcion TEXT
);

CREATE TABLE IF NOT EXISTS roles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT UNIQUE NOT NULL CHECK (nombre IN ('ADMIN','OPERARIO','CLIENTE')),
  descripcion TEXT NOT NULL,
  perm_dashboard       INTEGER NOT NULL DEFAULT 0,
  perm_gestion_inv     INTEGER NOT NULL DEFAULT 0,
  perm_registro_planta INTEGER NOT NULL DEFAULT 0,
  perm_reportes        INTEGER NOT NULL DEFAULT 0,
  perm_seguimiento     INTEGER NOT NULL DEFAULT 0,
  edit_inventario      INTEGER NOT NULL DEFAULT 0,
  edit_planta          INTEGER NOT NULL DEFAULT 0,
  creado_en TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cedula TEXT UNIQUE NOT NULL,
  nombre_completo TEXT NOT NULL,
  cargo TEXT NOT NULL,
  area TEXT NOT NULL,
  email TEXT UNIQUE,
  password_hash TEXT,
  telefono TEXT,
  turno TEXT CHECK (turno IN ('MAÑANA','TARDE','NOCHE','ADMINISTRATIVO')),
  activo INTEGER DEFAULT 1,
  creado_en TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE inventario (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  codigo TEXT UNIQUE NOT NULL,
  nombre_insumo TEXT NOT NULL,
  categoria_id INTEGER REFERENCES categorias(id) ON DELETE SET NULL,
  stock_actual NUMERIC DEFAULT 0,
  stock_minimo NUMERIC DEFAULT 100,
  unidad_medida TEXT NOT NULL,
  ubicacion_almacen TEXT,
  creado_en TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE movimientos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  insumo_id INTEGER NOT NULL REFERENCES inventario(id) ON DELETE CASCADE,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
  tipo_movimiento TEXT NOT NULL CHECK (tipo_movimiento IN ('ENTRADA','SALIDA_PRODUCCION','AJUSTE')),
  cantidad NUMERIC NOT NULL,
  observacion TEXT,
  fecha TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 5. Creación de Índices (Solo una vez y con IF NOT EXISTS para mayor seguridad)
CREATE INDEX IF NOT EXISTS idx_inventario_categoria ON inventario(categoria_id);
CREATE INDEX IF NOT EXISTS idx_movimientos_insumo  ON movimientos(insumo_id);
CREATE INDEX IF NOT EXISTS idx_movimientos_usuario ON movimientos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_movimientos_fecha   ON movimientos(fecha);
CREATE INDEX IF NOT EXISTS idx_movimientos_tipo    ON movimientos(tipo_movimiento);

-- 6. Creación de Triggers
DROP TRIGGER IF EXISTS trg_mov_after_insert;
DROP TRIGGER IF EXISTS trg_mov_after_delete;

CREATE TRIGGER trg_mov_after_insert
AFTER INSERT ON movimientos
FOR EACH ROW
BEGIN
  UPDATE inventario
     SET stock_actual = stock_actual +
         CASE NEW.tipo_movimiento
           WHEN 'ENTRADA'           THEN  NEW.cantidad
           WHEN 'SALIDA_PRODUCCION' THEN -NEW.cantidad
           WHEN 'AJUSTE'            THEN  NEW.cantidad
         END
   WHERE id = NEW.insumo_id;
END;

CREATE TRIGGER trg_mov_after_delete
AFTER DELETE ON movimientos
FOR EACH ROW
BEGIN
  UPDATE inventario
     SET stock_actual = stock_actual -
         CASE OLD.tipo_movimiento
           WHEN 'ENTRADA'           THEN  OLD.cantidad
           WHEN 'SALIDA_PRODUCCION' THEN -OLD.cantidad
           WHEN 'AJUSTE'            THEN  OLD.cantidad
         END
   WHERE id = OLD.insumo_id;
END;

-- Insertar datos de prueba iniciales
INSERT INTO categorias (nombre, descripcion) VALUES
('Polímeros y Resinas',              'Resinas termoplásticas base para inyección, extrusión y soplado'),
('Aditivos y Colorantes',            'Aditivos funcionales y colorantes para formulación'),
('Masterbatch y Pigmentos',          'Concentrados de color y aditivos en gránulos'),
('Cargas y Refuerzos',               'Materiales de relleno y refuerzo estructural'),
('Estabilizadores y Antioxidantes',  'Protección térmica, UV y oxidativa'),
('Plastificantes',                   'Flexibilizantes para PVC y elastómeros'),
('Lubricantes y Desmoldantes',       'Mejoran el flujo y desmoldeo en procesos'),
('Retardantes de Llama',             'Reducen la inflamabilidad de polímeros'),
('Biocidas y Fungicidas',            'Control microbiano en formulaciones y almacenamiento'),
('Espumantes y Agentes de Soplado',  'Generan estructura celular en espumados'),
('Catalizadores y Acelerantes',      'Inician o aceleran reacciones de curado'),
('Solventes y Diluyentes',           'Vehículos y limpieza de formulaciones'),
('Resinas Termoestables',            'Resinas de curado irreversible'),
('Elastómeros y Cauchos',            'Materiales con alta elasticidad y recuperación'),
('Fibras y Refuerzos Técnicos',      'Refuerzos de alto desempeño mecánico'),
('Materiales de Empaque',            'Insumos para envasado de producto terminado'),
('Insumos de Mantenimiento',         'Repuestos y consumibles para planta'),
('Insumos de Limpieza Industrial',   'Químicos y útiles de aseo industrial'),
('EPP y Seguridad',                  'Equipos de protección personal y seguridad'),
('Embalaje y Paletización',          'Insumos para transporte y almacenamiento');

INSERT INTO inventario (codigo, nombre_insumo, categoria_id, stock_actual, stock_minimo, unidad_medida, ubicacion_almacen) VALUES

-- Polímeros y Resinas (cat 1)
('POL-001','Polipropileno Homo (PP)',                    1, 2500, 500,  'Kg', 'Pasillo A - Silo 2'),
('POL-002','Polietileno Alta Densidad (HDPE)',           1,  350, 600,  'Kg', 'Pasillo A - Silo 4'),
('POL-003','Polietileno Baja Densidad (LDPE)',           1, 1800, 400,  'Kg', 'Pasillo A - Silo 1'),
('POL-004','Poliestireno Cristal (PS)',                  1,  900, 300,  'Kg', 'Pasillo A - Silo 3'),
('POL-005','PVC Resina Suspensión',                      1, 1200, 400,  'Kg', 'Pasillo B - Silo 1'),
('POL-006','ABS Grado Inyección',                        1,  600, 200,  'Kg', 'Pasillo B - Silo 2'),
('POL-007','PET Grado Botella',                          1, 2200, 500,  'Kg', 'Pasillo B - Silo 3'),
('POL-008','Poliamida Nylon 6',                          1,  450, 150,  'Kg', 'Pasillo B - Estante 5'),
('POL-009','EVA Copolímero',                             1,  380, 120,  'Kg', 'Pasillo B - Estante 6'),
('POL-010','Policarbonato (PC)',                         1,  210, 100,  'Kg', 'Pasillo B - Estante 7'),

-- Aditivos y Colorantes (cat 2)
('ADT-001','Negro de Humo N330',                         2,  800, 200,  'Kg', 'Estante C1'),
('ADT-002','Dióxido de Titanio Rutilo',                  2,  650, 200,  'Kg', 'Estante C1'),
('ADT-003','Estearato de Zinc',                          2,  420, 100,  'Kg', 'Estante C2'),
('ADT-004','Colorante Rojo Óxido',                       2,  150,  50,  'Kg', 'Estante C2'),
('ADT-005','Antiestático Interno',                       2,   75,  30,  'Kg', 'Estante C3'),
('ADT-006','Erucamida (Deslizante)',                     2,   90,  40,  'Kg', 'Estante C3'),

-- Masterbatch y Pigmentos (cat 3)
('MB-001','Masterbatch Azul Industrial',                 3,   80, 100,  'Kg', 'Estante B3'),
('MB-002','Masterbatch Verde Césped',                    3,  220,  80,  'Kg', 'Estante B3'),
('MB-003','Masterbatch Negro Concentrado',               3,  540, 150,  'Kg', 'Estante B4'),
('MB-004','Masterbatch Blanco Titánico',                 3,  480, 150,  'Kg', 'Estante B4'),
('MB-005','Masterbatch Rojo Carmín',                     3,  160,  60,  'Kg', 'Estante B5'),
('MB-006','Masterbatch Amarillo Cadmio',                 3,  140,  50,  'Kg', 'Estante B5'),
('MB-007','Masterbatch Naranja Seguridad',               3,   95,  40,  'Kg', 'Estante B6'),
('MB-008','Masterbatch Gris Grafito',                    3,  180,  60,  'Kg', 'Estante B6'),

-- Cargas y Refuerzos (cat 4)
('CAR-001','Carbonato de Calcio Precipitado',            4, 3500, 800,  'Kg', 'Silo Exterior 1'),
('CAR-002','Talco Industrial Micronizado',               4, 1200, 400,  'Kg', 'Silo Exterior 2'),
('CAR-003','Fibra de Vidrio Corta 6mm',                  4,  400, 150,  'Kg', 'Pasillo D - Estante 1'),
('CAR-004','Caolín Calcinado',                           4,  850, 250,  'Kg', 'Pasillo D - Estante 2'),
('CAR-005','Mica Moscovita 325 mesh',                    4,  300, 100,  'Kg', 'Pasillo D - Estante 2'),
('CAR-006','Wollastonita',                               4,  260, 100,  'Kg', 'Pasillo D - Estante 3'),
('CAR-007','Microesferas de Vidrio Huecas',              4,  140,  50,  'Kg', 'Pasillo D - Estante 3'),

-- Estabilizadores y Antioxidantes (cat 5)
('EST-001','Antioxidante Fenólico Irganox 1010',         5,  180,  60,  'Kg', 'Estante E1'),
('EST-002','Estabilizador UV Tinuvin 770',               5,  120,  40,  'Kg', 'Estante E1'),
('EST-003','Estabilizador Térmico Ca/Zn',                5,  320, 100,  'Kg', 'Estante E2'),
('EST-004','HALS Tinuvin 622',                           5,   95,  30,  'Kg', 'Estante E2'),

-- Plastificantes (cat 6)
('PLS-001','DOP (Dioctil Ftalato)',                      6,  900, 250,  'L',  'Tanque P1'),
('PLS-002','DINP (Diisononil Ftalato)',                  6,  650, 200,  'L',  'Tanque P1'),
('PLS-003','Aceite de Soja Epoxidado (ESBO)',            6,  280, 100,  'L',  'Tanque P2'),

-- Lubricantes y Desmoldantes (cat 7)
('LUB-001','Ácido Esteárico 1801',                       7,  240,  80,  'Kg', 'Estante F1'),
('LUB-002','Cera de Polietileno PE-Wax',                 7,  180,  60,  'Kg', 'Estante F1'),
('LUB-003','Silicona Desmoldante Spray',                 7,   60,  20,  'L',  'Estante F2'),
('LUB-004','Aceite Lubricante ISO 68',                   7,  400, 100,  'L',  'Cuarto Mantenimiento'),

-- Retardantes de Llama (cat 8)
('RET-001','Trióxido de Antimonio',                      8,   85,  30,  'Kg', 'Estante G1'),
('RET-002','Hidróxido de Aluminio (ATH)',                8,  550, 150,  'Kg', 'Estante G1'),
('RET-003','Retardante Bromado Deca-BDE',                8,   45,  20,  'Kg', 'Estante G2'),

-- Biocidas y Fungicidas (cat 9)
('BIO-001','Fungicida Industrial Acticide',              9,   70,  25,  'L',  'Estante H1'),
('BIO-002','Bactericida de Amplio Espectro',             9,   55,  20,  'L',  'Estante H1'),

-- Espumantes y Agentes de Soplado (cat 10)
('ESP-001','Azodicarbonamida (ADC)',                    10,  110,  40,  'Kg', 'Estante H2'),
('ESP-002','Bicarbonato de Sodio Grado Técnico',        10,  300, 100,  'Kg', 'Estante H2'),

-- Catalizadores y Acelerantes (cat 11)
('CAT-001','Peróxido de Benzoílo (BPO)',                11,   40,  15,  'Kg', 'Cuarto Químicos - Frío'),
('CAT-002','MEKP (Peróxido de Metil Etil Cetona)',      11,   35,  15,  'L',  'Cuarto Químicos - Frío'),

-- Solventes y Diluyentes (cat 12)
('SOL-001','Acetona Industrial',                        12,  450, 120,  'L',  'Cuarto Químicos'),
('SOL-002','Tolueno Industrial',                        12,  380, 100,  'L',  'Cuarto Químicos'),
('SOL-003','Xileno Técnico',                            12,  280,  80,  'L',  'Cuarto Químicos'),
('SOL-004','Alcohol Isopropílico 99%',                  12,  600, 150,  'L',  'Cuarto Químicos'),
('SOL-005','Metiletilcetona (MEK)',                     12,  210,  70,  'L',  'Cuarto Químicos'),
('SOL-006','Etanol Anhidro',                            12,  320, 100,  'L',  'Cuarto Químicos'),
('SOL-007','Thinner Universal',                         12,  500, 150,  'L',  'Cuarto Químicos'),

-- Resinas Termoestables (cat 13)
('TER-001','Resina Epóxica Bifásica',                   13,  220,  70,  'Kg', 'Pasillo J - Estante 1'),
('TER-002','Resina Poliéster Insaturada',               13,  340, 100,  'Kg', 'Pasillo J - Estante 1'),
('TER-003','Resina Fenólica Novolac',                   13,  150,  50,  'Kg', 'Pasillo J - Estante 2'),
('TER-004','Sistema Poliuretano 2K',                    13,  180,  60,  'Kg', 'Pasillo J - Estante 2'),

-- Elastómeros y Cauchos (cat 14)
('ELA-001','Caucho Natural RSS3',                       14,  400, 120,  'Kg', 'Pasillo K - Estante 1'),
('ELA-002','SBR 1502',                                  14,  320, 100,  'Kg', 'Pasillo K - Estante 1'),
('ELA-003','EPDM Grado Industrial',                     14,  260,  80,  'Kg', 'Pasillo K - Estante 2'),
('ELA-004','Silicona Líquida RTV',                      14,   90,  30,  'Kg', 'Pasillo K - Estante 2'),

-- Fibras y Refuerzos Técnicos (cat 15)
('FIB-001','Fibra de Carbono T300',                     15,   45,  20,  'Kg', 'Cuarto Climatizado'),
('FIB-002','Fibra de Aramida Kevlar',                   15,   30,  15,  'Kg', 'Cuarto Climatizado'),
('FIB-003','Fibra de Basalto Continua',                 15,   70,  25,  'Kg', 'Cuarto Climatizado'),

-- Materiales de Empaque (cat 16)
('EMP-001','Bolsas de Polietileno 50x70',               16, 5000,1500,  'Uni','Bodega Empaque'),
('EMP-002','Film Stretch 500mm',                        16,   80,  30,  'Rol','Bodega Empaque'),
('EMP-003','Big Bags 1 Tonelada',                       16,  220,  80,  'Uni','Bodega Empaque'),
('EMP-004','Sacos de Rafia 50kg',                       16, 2500, 800,  'Uni','Bodega Empaque'),
('EMP-005','Cajas de Cartón Corrugado',                 16,  600, 200,  'Uni','Bodega Empaque'),
('EMP-006','Esquineros de Cartón',                      16, 1800, 500,  'Uni','Bodega Empaque'),
('EMP-007','Film Alveolar (Burbuja)',                   16,   60,  25,  'Rol','Bodega Empaque'),

-- Insumos de Mantenimiento (cat 17)
('MAN-001','Grasa Industrial Litio EP2',                17,  120,  40,  'Kg', 'Cuarto Mantenimiento'),
('MAN-002','Aceite Hidráulico ISO 46',                  17,  380, 100,  'L',  'Cuarto Mantenimiento'),
('MAN-003','Rodamientos SKF 6205',                      17,   60,  20,  'Uni','Cuarto Mantenimiento'),
('MAN-004','Correas de Transmisión A-42',               17,   45,  15,  'Uni','Cuarto Mantenimiento'),
('MAN-005','Filtros de Aire Industriales',              17,   75,  25,  'Uni','Cuarto Mantenimiento'),
('MAN-006','Bandas Transportadoras PVC',                17,   20,  10,  'Mts','Cuarto Mantenimiento'),
('MAN-007','Cadenas de Transmisión ½"',                 17,   18,  10,  'Mts','Cuarto Mantenimiento'),

-- Insumos de Limpieza Industrial (cat 18)
('LIM-001','Detergente Industrial Desincrustante',      18,  220,  70,  'L',  'Cuarto Aseo'),
('LIM-002','Desengrasante Multiusos',                   18,  180,  60,  'L',  'Cuarto Aseo'),
('LIM-003','Alcohol Etílico 96%',                       18,  400, 120,  'L',  'Cuarto Aseo'),
('LIM-004','Hipoclorito de Sodio 13%',                  18,  260,  80,  'L',  'Cuarto Aseo'),

-- EPP y Seguridad (cat 19)
('EPP-001','Guantes de Nitrilo Caja x100',              19,  150,  50,  'Caja','Bodega EPP'),
('EPP-002','Mascarillas N95',                           19,  400, 150,  'Uni','Bodega EPP'),
('EPP-003','Tapones Auditivos Desechables',             19, 1200, 400,  'Par','Bodega EPP'),
('EPP-004','Gafas de Seguridad Anti-impacto',           19,  180,  60,  'Uni','Bodega EPP'),
('EPP-005','Botas Punta de Acero',                      19,   90,  30,  'Par','Bodega EPP'),
('EPP-006','Cascos de Seguridad con Barbiquejo',        19,   75,  25,  'Uni','Bodega EPP'),
('EPP-007','Overoles Desechables Tyvek',                19,  240,  80,  'Uni','Bodega EPP'),
('EPP-008','Caretas Faciales Transparentes',            19,   85,  30,  'Uni','Bodega EPP'),

-- Embalaje y Paletización (cat 20)
('EMB-001','Palets de Madera Estándar',                 20,  320, 100,  'Uni','Patio Embalaje'),
('EMB-002','Esquineros Plásticos',                      20,  900, 300,  'Uni','Patio Embalaje'),
('EMB-003','Film Retráctil (Termoencogible)',           20,   70,  25,  'Rol','Patio Embalaje'),
('EMB-004','Zunchos Plásticos 15mm',                    20,  240,  80,  'Rol','Patio Embalaje'),
('EMB-005','Etiquetas Adhesivas 100x150',               20, 3500,1200,  'Uni','Patio Embalaje');

INSERT INTO roles
(nombre, descripcion, perm_dashboard, perm_gestion_inv, perm_registro_planta, perm_reportes, perm_seguimiento, edit_inventario, edit_planta)
VALUES
('ADMIN',    'Administrador del sistema. Acceso total a todos los módulos.',
 1, 1, 1, 1, 1, 1, 1),

('OPERARIO', 'Operario de planta. Registra entradas y salidas, consulta inventario.',
 1, 1, 1, 0, 0, 0, 1),

('CLIENTE',  'Cliente externo. Consulta dashboard, reportes y seguimiento de pedidos.',
 1, 0, 0, 1, 1, 0, 0);

INSERT INTO usuarios (cedula, nombre_completo, cargo, area, email, telefono, turno) VALUES
('1020304050','Carlos Mendoza',      'Jefe de Almacén',           'Logística',     'carlos.mendoza@empresa.com',   '3001112201','MAÑANA'),
('1020304051','María González',      'Auxiliar de Almacén',       'Logística',     'maria.gonzalez@empresa.com',   '3001112202','MAÑANA'),
('1020304052','Juan Pérez',          'Operario de Inyección',     'Producción',    'juan.perez@empresa.com',       '3001112203','MAÑANA'),
('1020304053','Ana Rodríguez',       'Operaria de Extrusión',     'Producción',    'ana.rodriguez@empresa.com',    '3001112204','TARDE'),
('1020304054','Luis Fernández',      'Supervisor de Producción',  'Producción',    'luis.fernandez@empresa.com',   '3001112205','MAÑANA'),
('1020304055','Sofía Ramírez',       'Analista de Calidad',       'Calidad',       'sofia.ramirez@empresa.com',    '3001112206','MAÑANA'),
('1020304056','Pedro Castillo',      'Operario de Mezclas',       'Producción',    'pedro.castillo@empresa.com',   '3001112207','TARDE'),
('1020304057','Laura Jiménez',       'Coordinadora de Compras',   'Compras',       'laura.jimenez@empresa.com',    '3001112208','ADMINISTRATIVO'),
('1020304058','Andrés Torres',       'Técnico de Mantenimiento',  'Mantenimiento', 'andres.torres@empresa.com',    '3001112209','MAÑANA'),
('1020304059','Diana Vargas',        'Operaria de Soplado',       'Producción',    'diana.vargas@empresa.com',     '3001112210','NOCHE'),
('1020304060','Ricardo Ortiz',       'Montacarguista',            'Logística',     'ricardo.ortiz@empresa.com',    '3001112211','TARDE'),
('1020304061','Paola Sánchez',       'Auxiliar de Calidad',       'Calidad',       'paola.sanchez@empresa.com',    '3001112212','TARDE'),
('1020304062','Jorge Morales',       'Operario de Inyección',     'Producción',    'jorge.morales@empresa.com',    '3001112213','NOCHE'),
('1020304063','Claudia Reyes',       'Jefe de Producción',        'Producción',    'claudia.reyes@empresa.com',    '3001112214','ADMINISTRATIVO'),
('1020304064','Fernando Silva',      'Técnico Eléctrico',         'Mantenimiento', 'fernando.silva@empresa.com',   '3001112215','TARDE'),
('1020304065','Natalia Herrera',     'Analista de Inventarios',   'Logística',     'natalia.herrera@empresa.com',  '3001112216','MAÑANA'),
('1020304066','Óscar Gutiérrez',     'Operario de Extrusión',     'Producción',    'oscar.gutierrez@empresa.com',  '3001112217','NOCHE'),
('1020304067','Mónica Delgado',      'Coordinadora EHS',          'Seguridad',     'monica.delgado@empresa.com',   '3001112218','ADMINISTRATIVO'),
('1020304068','Alberto Rojas',       'Operario de Molinos',       'Producción',    'alberto.rojas@empresa.com',    '3001112219','MAÑANA'),
('1020304069','Verónica Castro',     'Asistente Administrativa',  'Administración','veronica.castro@empresa.com',  '3001112220','ADMINISTRATIVO');

INSERT INTO movimientos (insumo_id, usuario_id, tipo_movimiento, cantidad, observacion, fecha) VALUES
( 1, 1,'ENTRADA',3000,'OC-2025-0142 · Recepción Silo 2 · Lote PP-2405',          datetime('now','-55 days')),
( 2, 2,'ENTRADA', 800,'OC-2025-0148 · Lote HDPE-0113',                            datetime('now','-52 days')),
( 3, 1,'ENTRADA',2000,'OC-2025-0151 · Proveedor Petroquímica Andina',             datetime('now','-50 days')),
( 7,16,'ENTRADA',2500,'OC-2025-0155 · PET grado botella · Certificado FDA',       datetime('now','-48 days')),
(11, 2,'ENTRADA', 900,'OC-2025-0158 · Negro de Humo N330 · Big bags',             datetime('now','-46 days')),
(12, 1,'ENTRADA', 700,'OC-2025-0160 · TiO2 Rutilo · Paletizado',                  datetime('now','-45 days')),
(17,16,'ENTRADA', 150,'OC-2025-0163 · Masterbatch Azul · Bolsas 25kg',            datetime('now','-44 days')),
(25, 2,'ENTRADA',4000,'OC-2025-0165 · Carbonato Calcio · Silo Exterior 1',        datetime('now','-43 days')),
(26, 1,'ENTRADA',1500,'OC-2025-0168 · Talco Micronizado · Big bags',              datetime('now','-41 days')),
(32,16,'ENTRADA', 220,'OC-2025-0170 · Antioxidante Irganox 1010',                 datetime('now','-40 days')),
(36, 2,'ENTRADA',1000,'OC-2025-0172 · DOP · Tanque cisterna',                     datetime('now','-38 days')),
(39, 1,'ENTRADA', 300,'OC-2025-0175 · Ácido Esteárico 1801',                      datetime('now','-36 days')),
(43,16,'ENTRADA', 100,'OC-2025-0177 · Trióxido Antimonio · Cuarentena 48h',       datetime('now','-35 days')),
(48, 2,'ENTRADA', 150,'OC-2025-0179 · Azodicarbonamida · Lote ADC-01',            datetime('now','-34 days')),
(52, 1,'ENTRADA', 600,'OC-2025-0181 · Acetona Industrial · Bidones 200L',         datetime('now','-32 days')),
(53,16,'ENTRADA', 500,'OC-2025-0183 · Tolueno · Bidones 200L',                    datetime('now','-31 days')),
(59, 2,'ENTRADA', 250,'OC-2025-0185 · Resina Epóxica Bifásica',                   datetime('now','-30 days')),
(63, 1,'ENTRADA', 500,'OC-2025-0187 · Caucho Natural RSS3 · Cuarentena',          datetime('now','-28 days')),
(67,16,'ENTRADA',  60,'OC-2025-0189 · Fibra de Carbono T300 · Cuarto climatizado',datetime('now','-26 days')),
(70, 2,'ENTRADA',6000,'OC-2025-0191 · Bolsas PE 50x70',                           datetime('now','-24 days')),
(74, 1,'ENTRADA',3000,'OC-2025-0193 · Sacos de Rafia 50kg',                       datetime('now','-22 days')),
(80,16,'ENTRADA', 500,'OC-2025-0195 · Aceite Hidráulico ISO 46',                  datetime('now','-20 days')),
(84, 2,'ENTRADA', 250,'OC-2025-0197 · Detergente Desincrustante',                 datetime('now','-18 days')),
(88, 1,'ENTRADA', 200,'OC-2025-0199 · Guantes Nitrilo · Caja x100',               datetime('now','-15 days')),
(92,16,'ENTRADA', 300,'OC-2025-0201 · Mascarillas N95 · Caja 20 uni',             datetime('now','-13 days')),
(96, 2,'ENTRADA', 400,'OC-2025-0203 · Palets de Madera Estándar',                 datetime('now','-10 days'));

INSERT INTO movimientos (insumo_id, usuario_id, tipo_movimiento, cantidad, observacion, fecha) VALUES
( 1, 3,'SALIDA_PRODUCCION', 600,'OP-3301 · Inyección tapas · Turno mañana',          datetime('now','-29 days')),
( 1,13,'SALIDA_PRODUCCION', 550,'OP-3305 · Inyección envases · Turno noche',         datetime('now','-27 days')),
( 3, 4,'SALIDA_PRODUCCION', 500,'OP-3310 · Extrusión film · Turno tarde',            datetime('now','-25 days')),
( 7,10,'SALIDA_PRODUCCION', 400,'OP-3312 · Soplado botellas PET',                    datetime('now','-24 days')),
(11, 7,'SALIDA_PRODUCCION', 150,'OP-3315 · Mezcla concentrado negro',                datetime('now','-23 days')),
(12, 7,'SALIDA_PRODUCCION', 120,'OP-3317 · Formulación blanca',                      datetime('now','-23 days')),
(17, 5,'SALIDA_PRODUCCION',  50,'OP-3320 · Color masterbatch azul lote A',           datetime('now','-22 days')),
(18, 5,'SALIDA_PRODUCCION',  40,'OP-3321 · Masterbatch verde',                       datetime('now','-22 days')),
(19, 3,'SALIDA_PRODUCCION',  90,'OP-3324 · Masterbatch negro OP-3324',               datetime('now','-21 days')),
(25, 7,'SALIDA_PRODUCCION', 800,'OP-3328 · Carga mineral PP',                        datetime('now','-20 days')),
(26, 7,'SALIDA_PRODUCCION', 300,'OP-3330 · Talco en formulación HDPE',               datetime('now','-19 days')),
(32,19,'SALIDA_PRODUCCION',  30,'OP-3332 · Antioxidante masterbatch',                datetime('now','-18 days')),
(36, 4,'SALIDA_PRODUCCION', 200,'OP-3335 · Plastificante línea PVC',                 datetime('now','-17 days')),
(37, 4,'SALIDA_PRODUCCION', 150,'OP-3336 · DINP formulación flexible',               datetime('now','-17 days')),
(39, 7,'SALIDA_PRODUCCION',  60,'OP-3338 · Lubricante extrusión',                    datetime('now','-16 days')),
(52,19,'SALIDA_PRODUCCION', 120,'OP-3340 · Limpieza de moldes inyección',            datetime('now','-15 days')),
(54,19,'SALIDA_PRODUCCION', 100,'OP-3341 · Dilución tintas marcado',                 datetime('now','-15 days')),
(59,17,'SALIDA_PRODUCCION',  60,'OP-3344 · Encapsulado componentes',                 datetime('now','-13 days')),
(63,17,'SALIDA_PRODUCCION', 120,'OP-3347 · Formulación caucho técnico',              datetime('now','-12 days')),
(64,17,'SALIDA_PRODUCCION',  80,'OP-3348 · Mezcla SBR',                              datetime('now','-12 days')),
(67, 5,'SALIDA_PRODUCCION',  10,'OP-3350 · Refuerzo prototipo técnico',              datetime('now','-10 days')),
(70,10,'SALIDA_PRODUCCION',1200,'Empaque producto terminado lote 3301-3310',         datetime('now','-9 days')),
(74,10,'SALIDA_PRODUCCION', 600,'Empaque granel sacos 50kg',                         datetime('now','-8 days')),
(77, 8,'SALIDA_PRODUCCION',  20,'Mantenimiento preventivo extrusora 03',             datetime('now','-7 days')),
(80, 8,'SALIDA_PRODUCCION',  60,'Cambio aceite hidráulico inyectora 05',             datetime('now','-7 days')),
(82,15,'SALIDA_PRODUCCION',  30,'Cambio de filtros compresor 02',                    datetime('now','-6 days')),
(84, 6,'SALIDA_PRODUCCION',  50,'Aseo industrial sala de mezclas',                   datetime('now','-5 days')),
(88,18,'SALIDA_PRODUCCION',  30,'Dotación EPP turno mañana',                         datetime('now','-4 days')),
(92,18,'SALIDA_PRODUCCION',  60,'Reposición mascarillas planta',                     datetime('now','-3 days')),
(96,11,'SALIDA_PRODUCCION',  80,'Despacho producto terminado · Paletización',        datetime('now','-2 days'));


INSERT INTO movimientos (insumo_id, usuario_id, tipo_movimiento, cantidad, observacion, fecha) VALUES
( 2, 1,'AJUSTE', -50,'Conteo cíclico · diferencia por humedad en silo 4',           datetime('now','-11 days')),
(20,16,'AJUSTE',  15,'Conteo cíclico · sobrante identificado en estante B4',        datetime('now','-9 days')),
(42, 1,'AJUSTE',  -5,'Ajuste por vencimiento silicona desmoldante',                 datetime('now','-6 days')),
(55,16,'AJUSTE', -10,'Ajuste por evaporación · MEK cuarto químicos',                datetime('now','-5 days')),
(99, 1,'AJUSTE',  25,'Conteo cíclico · zunchos sobrantes patio embalaje',           datetime('now','-2 days'));
