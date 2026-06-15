Manual de Flujo de Trabajo - MJM 3D

Para mantener el orden y evitar conflictos, nuestro trabajo está sincronizado con nuestro tablero en KanbanFlow.

1. Ramas (Branches)

main: Rama protegida. Código estable y listo para presentación. ¡Prohibido hacer push directo!

dev: Rama de desarrollo. Aquí integramos las tareas terminadas.

feature/HU-[ID]: Ramas personales. Cada tarea debe tener su rama identificada con el ID de la Historia de Usuario (ej: feature/HU-101, feature/HU-102).

2. Flujo de Trabajo (Git Workflow)

Cada vez que vayas a trabajar en una tarea:

Sincronizar: Asegúrate de estar en dev y traer los últimos cambios:
git checkout dev
git pull origin dev

Crear rama: Crea tu rama según la HU asignada:
git checkout -b feature/HU-[ID_del_Kanban]

Desarrollar: Haz tus cambios y guarda tus avances con mensajes claros:
git add .
git commit -m "feat(HU-[ID]): descripción breve de la tarea"

Subir rama:
git push origin feature/HU-[ID_del_Kanban]

Pull Request (PR):

Ve a GitHub, abre un Pull Request desde feature/HU-[ID] hacia dev.

Incluye el link a la tarjeta de KanbanFlow en la descripción del PR.

Solicita revisión de un compañero.

3. Reglas de Oro

NUNCA hagas push a main. Todo pasa primero por dev.

Commits descriptivos: Usa el prefijo feat(HU-[ID]).

Comunicación: Si vas a mergear a dev, avisa por el grupo para evitar conflictos.

Antes de mergear: Verifica que el código cumple la definición de "hecho" de tu tarjeta en KanbanFlow.

4. Gestión de la demo

Cuando la rama dev esté estable, un administrador hará un Pull Request hacia main.
