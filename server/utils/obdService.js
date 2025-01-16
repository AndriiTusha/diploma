/* eslint-disable */
import noble from 'noble-winrt';
import { once } from 'events'; // Використовуємо для роботи з подіями

// Змінні для збереження динамічно знайдених UUID
let characteristic;
let OBD_SERVICE_UUID;
let OBD_CHARACTERISTIC_UUID;

// Підключення до OBD-II через Bluetooth

export const connectToOBD = async () => {
    if (noble.state !== 'poweredOn') {
        throw new Error('Bluetooth не увімкнено або недоступний');
    }

    console.log('Починаємо сканування...');
    noble.startScanning([], false);

    const peripheral = await new Promise((resolve, reject) => {
        noble.once('discover', resolve);
        setTimeout(() => reject(new Error('Пристрій не знайдено')), 10000); // Таймаут на пошук
    });

    console.log(`Знайдено пристрій: ${peripheral.advertisement.localName}`);
    noble.stopScanning();

    await peripheralConnect(peripheral);
};

// Підключення до знайденого пристрою та визначення UUID

const peripheralConnect = async (peripheral) => {
    await new Promise((resolve, reject) => {
        peripheral.connect((error) => {
            if (error) {
                return reject(new Error('Не вдалося підключитися до пристрою'));
            }
            resolve();
        });
    });

    console.log('Підключено до OBD-II адаптера');

    // Знаходимо сервіс та характеристику
    const { services, characteristics } = await discoverServicesAndCharacteristics(peripheral);

    // Зберігаємо перший знайдений UUID для роботи з OBD-II
    const service = services.find((svc) => svc.uuid.startsWith('ffe') || svc.uuid.includes('1101'));
    const char = characteristics.find((chr) => chr.uuid.startsWith('ffe') || chr.uuid.includes('1101'));

    if (!service || !char) {
        throw new Error('Не вдалося знайти відповідні UUID для сервісу чи характеристики');
    }

    OBD_SERVICE_UUID = service.uuid;
    OBD_CHARACTERISTIC_UUID = char.uuid;
    characteristic = char;

    console.log(`Сервіс UUID: ${OBD_SERVICE_UUID}`);
    console.log(`Характеристика UUID: ${OBD_CHARACTERISTIC_UUID}`);
};

// Знаходження всіх сервісів і характеристик

const discoverServicesAndCharacteristics = async (peripheral) => {
    const services = await new Promise((resolve, reject) => {
        peripheral.discoverServices([], (err, services) => {
            if (err) {
                return reject(new Error('Не вдалося отримати сервіси'));
            }
            resolve(services);
        });
    });

    const characteristics = [];
    for (const service of services) {
        const chars = await new Promise((resolve, reject) => {
            service.discoverCharacteristics([], (err, characteristics) => {
                if (err) {
                    return reject(new Error('Не вдалося отримати характеристики'));
                }
                resolve(characteristics);
            });
        });
        characteristics.push(...chars);
    }

    return { services, characteristics };
};

// Надсилання команди до OBD-II

export const sendCommand = async (command) => {
    if (!characteristic) {
        throw new Error('Характеристика OBD-II недоступна');
    }

    const commandBuffer = Buffer.from(`${command}\r`, 'utf-8');

    // Надсилання команди
    await new Promise((resolve, reject) => {
        characteristic.write(commandBuffer, false, (err) => {
            if (err) {
                return reject(new Error('Не вдалося надіслати команду'));
            }
            resolve();
        });
    });

    console.log(`Команда "${command}" надіслана`);

    // Отримання відповіді
    const [data] = await once(characteristic, 'data');
    const response = data.toString('utf-8').trim();
    console.log('Відповідь від OBD-II:', response);
    return response;
};

// Зчитування діагностичних кодів

export const getDiagnosticCodes = async () => {
    try {
        const response = await sendCommand('03'); // Команда для отримання кодів помилок
        console.log('Коди помилок:', response);
        return response;
    } catch (error) {
        console.error('Помилка отримання кодів помилок:', error);
        throw error;
    }
};
