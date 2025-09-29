import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';

// --- TYPE DEFINITIONS ---
type Vector2D = { x: number; y: number };

type ItemObject = {
  id: number;
  position: Vector2D;
  size: Vector2D;
  type: 'biodegradable';
  name: 'apple' | 'banana' | 'paperball';
};

type EnemyObject = {
  id: number;
  position: Vector2D;
  size: Vector2D;
  type: 'non-biodegradable';
  name: 'bottle' | 'can' | 'plasticbag';
  velocity: Vector2D;
};

type HazardObject = {
    id: number;
    position: Vector2D;
    size: Vector2D;
    type: 'hazard';
    name: 'glass';
}

type CloudObject = {
    id: number;
    position: Vector2D;
    size: Vector2D;
    speed: number;
}

type Platform = { id: number; position: Vector2D; size: Vector2D, type: 'G' | 'D' | 'B' | 'P' | 'S' };
type GameState = 'start' | 'playing' | 'gameOver';

// --- GAME CONSTANTS ---
const SCREEN_WIDTH = 800;
const SCREEN_HEIGHT = 600;
const PLAYER_WIDTH = 32;
const PLAYER_HEIGHT = 48;
const GRAVITY = 0.6;
const JUMP_STRENGTH = -15;
const BASE_PLAYER_SPEED = 4;
const BASE_ENEMY_SPEED = 0.5;
const TILE_SIZE = 40;
const LEVEL_CHUNK_WIDTH = SCREEN_WIDTH;


// --- ASSET COMPONENTS (Pixel Art via Inline SVG) ---

const PlayerCharacter = ({ direction }: { direction: 'left' | 'right' }) => (
  <div style={{ width: PLAYER_WIDTH, height: PLAYER_HEIGHT, transform: `scaleX(${direction === 'left' ? -1 : 1})` }}>
    <svg viewBox="0 0 16 24" style={{ imageRendering: 'pixelated', width: '100%', height: '100%' }}>
      {/* Hat */}
      <rect x="4" y="0" width="8" height="2" fill="#22C55E" />
      <rect x="3" y="2" width="12" height="2" fill="#22C55E" />
      {/* Hair */}
      <rect x="2" y="4" width="2" height="4" fill="#A16207" />
      <rect x="11" y="4" width="2" height="2" fill="#A16207" />
      {/* Face */}
      <rect x="4" y="4" width="7" height="6" fill="#FCD34D" />
      {/* Eye */}
      <rect x="8" y="6" width="2" height="2" fill="#000000" />
       {/* Overalls */}
      <rect x="4" y="10" width="8" height="4" fill="#2563EB" />
      <rect x="2" y="12" width="2" height="2" fill="#2563EB" />
      <rect x="12" y="12" width="2" height="2" fill="#2563EB" />
       {/* Shirt */}
      <rect x="4" y="10" width="2" height="4" fill="#E11D48" />
      <rect x="10" y="10" width="2" height="4" fill="#E11D48" />
      <rect x="2" y="14" width="12" height="2" fill="#E11D48" />
      {/* Shoes */}
      <rect x="2" y="20" width="4" height="4" fill="#A16207" />
      <rect x="10" y="20" width="4" height="4" fill="#A16207" />
       {/* Legs */}
       <rect x="4" y="16" width="2" height="4" fill="#FCD34D" />
       <rect x="10" y="16" width="2" height="4" fill="#FCD34D" />
    </svg>
  </div>
);

const Apple = () => (
    <div style={{ width: TILE_SIZE, height: TILE_SIZE }}>
        <svg viewBox="0 0 16 16" style={{ imageRendering: 'pixelated', width: '100%', height: '100%' }}>
            <rect x="6" y="1" width="2" height="2" fill="#654321" />
            <rect x="5" y="3" width="1" height="1" fill="#22C55E" />
            <rect x="4" y="4" width="8" height="2" fill="#EF4444" />
            <rect x="3" y="6" width="10" height="6" fill="#EF4444" />
            <rect x="4" y="12" width="8" height="1" fill="#DC2626" />
            <rect x="5" y="5" width="2" height="2" fill="#FDE047" opacity="0.7" />
        </svg>
    </div>
);

const Banana = () => (
    <div style={{ width: TILE_SIZE, height: TILE_SIZE }}>
        <svg viewBox="0 0 16 16" style={{ imageRendering: 'pixelated', width: '100%', height: '100%' }}>
            <path d="M3,12 C3,12 4,8 8,7 C12,6 13,3 13,3 C13,3 12,6 8,8 C4,10 3,13 3,13Z" fill="#FDE047" />
            <path d="M13,3 L12,4 L8,8 L4,13 L3,12 L8,7 L12,3Z" stroke="#FBBF24" fill="none" />
            <rect x="11" y="1" width="2" height="2" fill="#654321" />
        </svg>
    </div>
);

const PaperBall = () => (
    <div style={{ width: TILE_SIZE, height: TILE_SIZE }}>
        <svg viewBox="0 0 16 16" style={{ imageRendering: 'pixelated', width: '100%', height: '100%' }}>
            <path d="M4,4 C2,6 3,10 5,12 C7,14 11,15 13,12 C15,9 14,5 11,4 C9,3 6,2 4,4Z" fill="#E5E7EB" />
            <path d="M5,5 L7,8 L5,9Z" fill="#9CA3AF" />
            <path d="M10,9 L12,11 L12,9Z" fill="#9CA3AF" />
        </svg>
    </div>
);


const PlasticBottle = () => (
    <div style={{ width: TILE_SIZE, height: TILE_SIZE }}>
        <svg viewBox="0 0 16 16" style={{ imageRendering: 'pixelated', width: '100%', height: '100%' }}>
            <rect x="6" y="1" width="4" height="2" fill="#DC2626" />
            <rect x="5" y="3" width="6" height="1" fill="#99F6E4" />
            <rect x="4" y="4" width="8" height="10" fill="#67E8F9" opacity="0.8"/>
            <rect x="4" y="14" width="8" height="1" fill="#0D9488" />
        </svg>
    </div>
);

const SodaCan = () => (
    <div style={{ width: TILE_SIZE, height: TILE_SIZE }}>
        <svg viewBox="0 0 16 16" style={{ imageRendering: 'pixelated', width: '100%', height: '100%' }}>
            <rect x="4" y="3" width="8" height="10" fill="#9CA3AF" />
            <rect x="3" y="4" width="10" height="8" fill="#6B7280" />
            <rect x="4" y="3" width="8" height="1" fill="#E5E7EB" />
            <rect x="4" y="12" width="8" height="1" fill="#4B5563" />
            <rect x="6" y="5" width="4" height="6" fill="#EF4444" />
        </svg>
    </div>
);

const PlasticBag = () => (
    <div style={{ width: TILE_SIZE, height: TILE_SIZE }}>
        <svg viewBox="0 0 16 16" style={{ imageRendering: 'pixelated', width: '100%', height: '100%' }}>
            <path d="M3,6 C3,3 5,2 8,2 C11,2 13,3 13,6 L14,14 L2,14 L3,6Z" fill="#F9FAFB" opacity="0.8" />
            <rect x="6" y="3" width="1" height="3" fill="#EF4444" />
            <rect x="9" y="3" width="1" height="3" fill="#EF4444" />
            <path d="M4,6 L12,6" stroke="#E5E7EB" fill="none" />
        </svg>
    </div>
);

const BrokenGlass = () => (
    <div style={{ width: TILE_SIZE, height: TILE_SIZE / 2 }}>
         <svg viewBox="0 0 16 8" style={{ imageRendering: 'pixelated', width: '100%', height: '100%' }}>
            <path d="M2,7 L4,2 L6,7Z" fill="#67E8F9" opacity="0.6" />
            <path d="M7,7 L8,4 L10,7Z" fill="#99F6E4" opacity="0.6" />
            <path d="M11,7 L13,1 L14,7Z" fill="#67E8F9" opacity="0.6" />
        </svg>
    </div>
);

const Cloud = ({ style }: { style: React.CSSProperties }) => (
    <div className="absolute" style={style}>
        <svg viewBox="0 0 40 20" style={{ imageRendering: 'pixelated', width: '100%', height: '100%' }}>
            <rect x="5" y="5" width="30" height="10" fill="white" />
            <rect x="10" y="0" width="20" height="5" fill="white" />
            <rect x="0" y="10" width="5" height="5" fill="white" />
            <rect x="35" y="10" width="5" height="5" fill="white" />
        </svg>
    </div>
);


const BrickBlock = () => (
    <div style={{ width: TILE_SIZE, height: TILE_SIZE, background: '#F97316', border: '2px solid #9A3412' }}>
        <div className="w-full h-full relative">
            <div className="absolute top-0 left-0 w-full h-px bg-[#9A3412]"></div>
            <div className="absolute top-1/2 left-0 w-full h-px bg-[#9A3412] -translate-y-px"></div>
            <div className="absolute top-0 left-1/2 w-px h-full bg-[#9A3412]"></div>
        </div>
    </div>
);

// --- MAIN GAME COMPONENT ---
export default function EcoMario() {
    const [gameState, setGameState] = useState<GameState>('start');
    const [score, setScore] = useState(0);
    const [playerPosition, setPlayerPosition] = useState<Vector2D>({ x: 100, y: 400 });
    const [playerVelocity, setPlayerVelocity] = useState<Vector2D>({ x: 0, y: 0 });
    const [isJumping, setIsJumping] = useState(false);
    const [direction, setDirection] = useState<'left' | 'right'>('right');
    const [cameraX, setCameraX] = useState(0);

    const [items, setItems] = useState<ItemObject[]>([]);
    const [enemies, setEnemies] = useState<EnemyObject[]>([]);
    const [hazards, setHazards] = useState<HazardObject[]>([]);
    const [platforms, setPlatforms] = useState<Platform[]>([]);
    const [clouds, setClouds] = useState<CloudObject[]>([]);
    
    const keys = useRef<{ [key: string]: boolean }>({}).current;
    const generatedUntilX = useRef(0);
    const gameFrame = useRef(0);
    const animationFrameId = useRef<number>();
    const gameContainerRef = useRef<HTMLDivElement>(null);

    // --- LEVEL GENERATION ---
    const generateChunk = useCallback((startX: number) => {
        const newPlatforms: Platform[] = [];
        const newItems: ItemObject[] = [];
        const newEnemies: EnemyObject[] = [];
        const newHazards: HazardObject[] = [];
        
        let lastPlatformY = SCREEN_HEIGHT - TILE_SIZE * 2;
        let currentX = startX;
        const endX = startX + LEVEL_CHUNK_WIDTH;

        while(currentX < endX) {
            const groundY = SCREEN_HEIGHT - TILE_SIZE;
            newPlatforms.push({ id: Math.random(), position: { x: currentX, y: groundY }, size: { x: TILE_SIZE, y: TILE_SIZE }, type: 'G' });
            newPlatforms.push({ id: Math.random(), position: { x: currentX, y: groundY + TILE_SIZE }, size: { x: TILE_SIZE, y: TILE_SIZE }, type: 'D' });
            
            // Chance to spawn an object on the ground
            if (currentX > TILE_SIZE * 5 && Math.random() < 0.15) { // Lower chance for ground objects
                const objectX = currentX;
                const objectY = groundY - TILE_SIZE;
                const rand = Math.random();

                if (rand < 0.5) { // 50% chance for a good item
                    const itemType = Math.random();
                    let itemName: 'apple' | 'banana' | 'paperball' = 'apple';
                    if (itemType < 0.45) itemName = 'apple';
                    else if (itemType < 0.9) itemName = 'banana';
                    else itemName = 'paperball';
                    newItems.push({ id: Math.random(), position: {x: objectX, y: objectY}, size: {x: TILE_SIZE, y: TILE_SIZE}, type: 'biodegradable', name: itemName });
                } else if (rand < 0.85) { // 35% chance for a moving enemy
                    const enemyName: 'bottle' | 'can' = Math.random() < 0.5 ? 'bottle' : 'can';
                    newEnemies.push({ id: Math.random(), position: {x: objectX, y: objectY}, size: {x: TILE_SIZE, y: TILE_SIZE}, type: 'non-biodegradable', name: enemyName, velocity: { x: -BASE_ENEMY_SPEED, y: 0 } });
                } else { // 15% chance for a stationary hazard
                    newHazards.push({ id: Math.random(), position: {x: objectX, y: groundY - (TILE_SIZE / 2)}, size: {x: TILE_SIZE, y: TILE_SIZE / 2}, type: 'hazard', name: 'glass' });
                }
            }
            
            if (Math.random() < 0.7 && currentX > startX + TILE_SIZE * 3) { // Increased platform frequency
                 const heightVar = (Math.random() - 0.5) * TILE_SIZE * 4;
                 let platformY = Math.max(TILE_SIZE * 4, Math.min(SCREEN_HEIGHT - TILE_SIZE * 5, lastPlatformY + heightVar));
                 const platformLength = Math.floor(Math.random() * 4) + 2;

                 for (let i = 0; i < platformLength; i++) {
                     const x = currentX + i * TILE_SIZE;
                     if (x > endX) break;
                     newPlatforms.push({ id: Math.random(), position: { x, y: platformY }, size: { x: TILE_SIZE, y: TILE_SIZE }, type: 'B' });
                 }
                 lastPlatformY = platformY;

                 if(Math.random() < 0.65) { // Increased object frequency on platforms
                    const objectX = currentX + Math.floor(platformLength/2) * TILE_SIZE;
                    const objectY = platformY - TILE_SIZE;
                    const rand = Math.random();

                    if (rand < 0.55) {
                        const itemType = Math.random();
                        let itemName: 'apple' | 'banana' | 'paperball' = 'apple';
                        if (itemType < 0.45) itemName = 'apple';
                        else if (itemType < 0.9) itemName = 'banana';
                        else itemName = 'paperball';
                        newItems.push({ id: Math.random(), position: {x: objectX, y: objectY}, size: {x: TILE_SIZE, y: TILE_SIZE}, type: 'biodegradable', name: itemName });
                    } else if (rand < 0.85) {
                        const enemyType = Math.random();
                        let enemyName: 'bottle' | 'can' | 'plasticbag' = 'bottle';
                        let enemyVelX = -BASE_ENEMY_SPEED;
                        if (enemyType < 0.45) enemyName = 'bottle';
                        else if (enemyType < 0.9) enemyName = 'can';
                        else {
                            enemyName = 'plasticbag';
                            enemyVelX = 0;
                        }
                        newEnemies.push({ id: Math.random(), position: {x: objectX, y: objectY}, size: {x: TILE_SIZE, y: TILE_SIZE}, type: 'non-biodegradable', name: enemyName, velocity: { x: enemyVelX, y: 0 } });
                    } else {
                        newHazards.push({ id: Math.random(), position: {x: objectX, y: platformY - (TILE_SIZE / 2)}, size: {x: TILE_SIZE, y: TILE_SIZE / 2}, type: 'hazard', name: 'glass' });
                    }
                 }

                 currentX += (platformLength + Math.floor(Math.random() * 2) + 1) * TILE_SIZE; // Further reduced gap size
            } else {
                 currentX += TILE_SIZE;
            }
        }

        setPlatforms(prev => [...prev, ...newPlatforms]);
        setItems(prev => [...prev, ...newItems]);
        setEnemies(prev => [...prev, ...newEnemies]);
        setHazards(prev => [...prev, ...newHazards]);
        generatedUntilX.current = endX;
    }, []);

    const cleanupDistantObjects = useCallback(() => {
        const cleanupLimit = cameraX - SCREEN_WIDTH;
        if (gameFrame.current % 120 === 0) {
            setPlatforms(prev => prev.filter(p => p.position.x > cleanupLimit));
            setItems(prev => prev.filter(i => i.position.x > cleanupLimit));
            setEnemies(prev => prev.filter(e => e.position.x > cleanupLimit));
            setHazards(prev => prev.filter(h => h.position.x > cleanupLimit));
        }
    }, [cameraX]);

    const resetGame = useCallback(() => {
        setPlayerPosition({ x: 100, y: 400 });
        setPlayerVelocity({ x: 0, y: 0 });
        setScore(0);
        setPlatforms([]);
        setItems([]);
        setEnemies([]);
        setHazards([]);
        setCameraX(0);
        generatedUntilX.current = 0;
        
        const initialClouds: CloudObject[] = [];
        for (let i = 0; i < 5; i++) {
            initialClouds.push({
                id: i,
                position: { x: Math.random() * SCREEN_WIDTH, y: Math.random() * (SCREEN_HEIGHT / 3) },
                size: { x: (Math.random() * 50) + 60, y: (Math.random() * 25) + 30 },
                speed: (Math.random() * 0.2) + 0.1
            });
        }
        setClouds(initialClouds);
        
        generateChunk(0);
        generateChunk(LEVEL_CHUNK_WIDTH);
        
        setGameState('playing');
    }, [generateChunk]);
    
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
             if (e.code === 'ArrowUp' || e.code === 'Space') e.preventDefault();
             keys[e.code] = true;
        };
        const handleKeyUp = (e: KeyboardEvent) => {
             if (e.code === 'ArrowUp' || e.code === 'Space') e.preventDefault();
            keys[e.code] = false;
        };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [keys]);

    // Effect for handling responsive scaling
    useEffect(() => {
        const handleResize = () => {
            if (gameContainerRef.current) {
                const container = gameContainerRef.current;
                const parent = container.parentElement;
                if (parent) {
                    const parentWidth = parent.clientWidth;
                    const scale = Math.min(1, parentWidth / SCREEN_WIDTH);
                    container.style.transform = `scale(${scale})`;
                }
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    const gameLoop = useCallback(() => {
        if (gameState !== 'playing') return;
        gameFrame.current++;

        if(playerPosition.x > generatedUntilX.current - LEVEL_CHUNK_WIDTH) {
            generateChunk(generatedUntilX.current);
        }
        cleanupDistantObjects();

        setClouds(prevClouds => prevClouds.map(cloud => {
            let newX = cloud.position.x - cloud.speed;
            if (newX < -cloud.size.x) {
                newX = SCREEN_WIDTH;
                return { ...cloud, position: { x: newX, y: Math.random() * (SCREEN_HEIGHT / 3) } };
            }
            return { ...cloud, position: { ...cloud.position, x: newX } };
        }));

        let pos = { ...playerPosition };
        let vel = { ...playerVelocity };

        const currentPlayerSpeed = BASE_PLAYER_SPEED + Math.floor(score / 50) * 0.5;
        vel.x = 0;
        if (keys['ArrowLeft']) {
            vel.x = -currentPlayerSpeed;
            setDirection('left');
        }
        if (keys['ArrowRight']) {
            vel.x = currentPlayerSpeed;
            setDirection('right');
        }
        pos.x += vel.x;
        pos.x = Math.max(0, pos.x);

        vel.y += GRAVITY;
        pos.y += vel.y;

        let onGround = false;
        const playerRect = { x: pos.x, y: pos.y, width: PLAYER_WIDTH, height: PLAYER_HEIGHT };

        for (const p of platforms) {
            const platformRect = { x: p.position.x, y: p.position.y, width: p.size.x, height: p.size.y };

            if (playerRect.x < platformRect.x + platformRect.width && playerRect.x + playerRect.width > platformRect.x && playerRect.y < platformRect.y + platformRect.height && playerRect.y + playerRect.height > platformRect.y) {
                const prevPlayerBottom = (pos.y - vel.y) + PLAYER_HEIGHT;
                if (vel.y >= 0 && prevPlayerBottom <= platformRect.y) {
                    pos.y = platformRect.y - PLAYER_HEIGHT;
                    vel.y = 0;
                    onGround = true;
                    setIsJumping(false);
                } else if (vel.y < 0 && pos.y >= platformRect.y + platformRect.height) {
                    pos.y = platformRect.y + platformRect.height;
                    vel.y = 0;
                } else {
                     if (vel.x > 0) pos.x = platformRect.x - PLAYER_WIDTH;
                     else if (vel.x < 0) pos.x = platformRect.x + platformRect.width;
                }
            }
        }
        
        if ((keys['ArrowUp'] || keys['Space']) && onGround && !isJumping) {
            vel.y = JUMP_STRENGTH;
            setIsJumping(true);
        }
        
        setItems(prev => prev.filter(item => {
            if (Math.abs(pos.x - item.position.x) < 40 && Math.abs(pos.y - item.position.y) < 40) {
                setScore(s => s + 10);
                return false;
            }
            return true;
        }));

        for (const hazard of hazards) {
            if (playerRect.x < hazard.position.x + hazard.size.x && playerRect.x + playerRect.width > hazard.position.x && playerRect.y < hazard.position.y + hazard.size.y && playerRect.y + playerRect.height > hazard.position.y) {
                setGameState('gameOver');
                return;
            }
        }

        setEnemies(prevEnemies => {
            const updatedEnemies = prevEnemies.map(enemy => {
                let newEnemyPos = { ...enemy.position };
                let newEnemyVel = { ...enemy.velocity };
                
                if (enemy.name === 'plasticbag') {
                    const verticalOffset = Math.sin(gameFrame.current / 30) * 0.7;
                    newEnemyPos.y += verticalOffset;
                } else {
                    newEnemyPos.x += newEnemyVel.x;
                    newEnemyVel.y += GRAVITY;
                    newEnemyPos.y += newEnemyVel.y;
                    let enemyOnGround = false;
                    for (const p of platforms) {
                        const enemyRect = { ...newEnemyPos, width: TILE_SIZE, height: TILE_SIZE };
                        const platformRect = { ...p.position, width: p.size.x, height: p.size.y };
                        if (enemyRect.x < platformRect.x + platformRect.width && enemyRect.x + enemyRect.width > platformRect.x && enemyRect.y < platformRect.y + platformRect.height && enemyRect.y + enemyRect.height > platformRect.y) {
                             if(newEnemyVel.y >=0 && (enemy.position.y + TILE_SIZE) <= platformRect.y) {
                                 newEnemyPos.y = platformRect.y - TILE_SIZE;
                                 newEnemyVel.y = 0;
                                 enemyOnGround = true;
                             } else if (Math.abs(newEnemyPos.y - p.position.y) < TILE_SIZE / 2) { 
                                  newEnemyVel.x *= -1;
                             }
                        }
                    }
                    if (enemyOnGround) {
                        const tileInFrontX = newEnemyPos.x + (newEnemyVel.x > 0 ? TILE_SIZE : -TILE_SIZE);
                        const tileBelowInFrontY = newEnemyPos.y + TILE_SIZE;
                        const groundInFront = platforms.some(p => tileInFrontX >= p.position.x && tileInFrontX < p.position.x + p.size.x && tileBelowInFrontY >= p.position.y && tileBelowInFrontY < p.position.y + p.size.y);
                        if (!groundInFront) {
                            newEnemyVel.x *= -1;
                        }
                    }
                }
                return { ...enemy, position: newEnemyPos, velocity: newEnemyVel };
            });
            for (const enemy of updatedEnemies) {
                if (Math.abs(pos.x - enemy.position.x) < 35 && Math.abs(pos.y - enemy.position.y) < 45) {
                    if (enemy.name !== 'plasticbag' && vel.y > 0 && (pos.y + PLAYER_HEIGHT) < (enemy.position.y + 20)) {
                        setScore(s => s + 20);
                        vel.y = -8;
                        return updatedEnemies.filter(e => e.id !== enemy.id);
                    } else {
                        setGameState('gameOver');
                        return updatedEnemies;
                    }
                }
            }
            return updatedEnemies;
        });

        if (pos.y > SCREEN_HEIGHT + PLAYER_HEIGHT) {
            setGameState('gameOver');
        }

        setPlayerPosition(pos);
        setPlayerVelocity(vel);
        
        const targetCameraX = pos.x - SCREEN_WIDTH / 4;
        setCameraX(prevCamX => prevCamX + (targetCameraX - prevCamX) * 0.1);

        animationFrameId.current = requestAnimationFrame(gameLoop);
    }, [gameState, playerPosition, playerVelocity, platforms, hazards, score, generateChunk, cleanupDistantObjects]);


    useEffect(() => {
        if (gameState === 'playing') {
            animationFrameId.current = requestAnimationFrame(gameLoop);
        } else if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
        }
        return () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [gameState, gameLoop]);
    
    const renderItem = (obj: ItemObject) => {
        let Component;
        switch(obj.name) {
            case 'apple': Component = Apple; break;
            case 'banana': Component = Banana; break;
            case 'paperball': Component = PaperBall; break;
        }
        return <div key={obj.id} className="absolute" style={{ left: obj.position.x, top: obj.position.y }}><Component /></div>;
    };

    const renderEnemy = (obj: EnemyObject) => {
        let Component;
        switch(obj.name) {
            case 'bottle': Component = PlasticBottle; break;
            case 'can': Component = SodaCan; break;
            case 'plasticbag': Component = PlasticBag; break;
        }
        return <div key={obj.id} className="absolute" style={{ left: obj.position.x, top: obj.position.y }}><Component /></div>;
    }

    const renderHazard = (obj: HazardObject) => {
        let Component = BrokenGlass;
        return <div key={obj.id} className="absolute" style={{ left: obj.position.x, top: obj.position.y }}><Component /></div>;
    }
    
    const renderPlatform = (p: Platform) => {
        let PlatformComponent;
        if(p.type === 'G') PlatformComponent = <div style={{width: TILE_SIZE, height: TILE_SIZE, background: '#16A34A', borderBottom: '4px solid #14532D', borderRight: '2px solid #14532D'}}/>;
        else if(p.type === 'D') PlatformComponent = <div style={{width: TILE_SIZE, height: TILE_SIZE, background: '#A16207'}}/>;
        else if(p.type === 'B') PlatformComponent = <BrickBlock />;
        else if(p.type === 'P') PlatformComponent = <div style={{width: TILE_SIZE, height: TILE_SIZE, background: '#11194bff' }}/>
        else if(p.type === 'S') PlatformComponent = <div style={{width: TILE_SIZE, height: TILE_SIZE, background: '#475569', border: '2px solid #1E293B' }}/>
        
        return <div key={p.id} className="absolute" style={{ left: p.position.x, top: p.position.y }}>{PlatformComponent}</div>
    }
    
    const visiblePlatforms = useMemo(() => platforms.filter(p => p.position.x > cameraX - TILE_SIZE && p.position.x < cameraX + SCREEN_WIDTH + TILE_SIZE), [platforms, cameraX]);
    const visibleItems = useMemo(() => items.filter(i => i.position.x > cameraX - TILE_SIZE && i.position.x < cameraX + SCREEN_WIDTH + TILE_SIZE), [items, cameraX]);
    const visibleEnemies = useMemo(() => enemies.filter(e => e.position.x > cameraX - TILE_SIZE && e.position.x < cameraX + SCREEN_WIDTH + TILE_SIZE), [enemies, cameraX]);
    const visibleHazards = useMemo(() => hazards.filter(h => h.position.x > cameraX - TILE_SIZE && h.position.x < cameraX + SCREEN_WIDTH + TILE_SIZE), [hazards, cameraX]);

    return (
        <div className="w-full min-h-screen p-2 sm:p-4 flex flex-col items-center justify-center bg-[#38B6FF] font-mono select-none">
             <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{ fontFamily: '"Press Start 2P", cursive' }}>Eco Hero</h1>
             <div className="w-full max-w-[800px] flex justify-center">
                <div ref={gameContainerRef} style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT, transformOrigin: 'top center' }} className="relative overflow-hidden bg-[#7dd3fc] rounded-lg shadow-2xl">
                    {gameState === 'start' && (
                        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white">
                            <h2 className="text-5xl mb-4" style={{ fontFamily: '"Press Start 2P", cursive' }}>Ready?</h2>
                            <button onClick={resetGame} className="px-8 py-4 text-2xl bg-green-500 rounded-lg shadow-lg hover:bg-green-600 transition-transform transform hover:scale-105" style={{ fontFamily: '"Press Start 2P", cursive' }}>Start Game</button>
                        </div>
                    )}
                    {gameState === 'gameOver' && (
                        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white">
                            <h2 className="text-5xl mb-4 text-red-500" style={{ fontFamily: '"Press Start 2P", cursive' }}>Game Over</h2>
                            <p className="text-2xl mb-6" style={{ fontFamily: '"Press Start 2P", cursive' }}>Final Score: {score}</p>
                            <button onClick={resetGame} className="px-8 py-4 text-2xl bg-blue-500 rounded-lg shadow-lg hover:bg-blue-600 transition-transform transform hover:scale-105" style={{ fontFamily: '"Press Start 2P", cursive' }}>Try Again</button>
                        </div>
                    )}

                    {/* Clouds */}
                    {clouds.map(cloud => (
                        <Cloud key={cloud.id} style={{
                            left: cloud.position.x,
                            top: cloud.position.y,
                            width: cloud.size.x,
                            height: cloud.size.y,
                            opacity: 0.8,
                            zIndex: 0
                        }} />
                    ))}

                    <div className="absolute top-4 left-4 text-white text-2xl z-20" style={{ fontFamily: '"Press Start 2P", cursive' }}>
                        SCORE: {score}
                    </div>
                    
                    <div className="absolute z-10" style={{ transform: `translateX(-${cameraX}px)` }}>
                        {/* Player */}
                        <div className="absolute" style={{ left: playerPosition.x, top: playerPosition.y }}>
                            <PlayerCharacter direction={direction} />
                        </div>

                        {/* Items, Enemies & Hazards */}
                        {visibleItems.map(renderItem)}
                        {visibleEnemies.map(renderEnemy)}
                        {visibleHazards.map(renderHazard)}

                        {/* Platforms */}
                        {visiblePlatforms.map(renderPlatform)}

                    </div>
                </div>
            </div>
             <div className="text-white mt-4 text-center text-sm sm:text-base">
                <p><span className="font-bold">Controls:</span> Use Arrow Keys to move, Arrow Up or Space to jump.</p>
                <p><span className="font-bold">Goal:</span> Collect good items (fruit) and stomp on trash enemies to score points!</p>
            </div>
        </div>
    );
}

