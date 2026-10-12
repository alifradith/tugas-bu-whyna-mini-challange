import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  BadRequestException,
} from '@nestjs/common';

import { AppService } from './app.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // =========================
  // SOAL 1 - CEK BILANGAN
  // =========================
  
  @Get('bilangan/:angka')
  checkBilangan(@Param('angka') angka: string) {
    const nilai = Number(angka);

    if (
      Number.isNaN(nilai) ||
      !Number.isInteger(nilai) ||
      nilai < 1 ||
      nilai > 100
    ) {
      throw new BadRequestException(
        'angka harus bilangan bulat antara 1 sampai 100',
      );
    }

    return this.appService.checkBilangan(nilai);
  }


  // SOAL 2 - KONVERSI SUHU
  
  

  @Get('suhu/konversi')
  konversiSuhu(
    @Query('nilai') nilai: string,
    @Query('dari') dari: string,
    @Query('ke') ke: string,
  ) {
    // Semua query wajib diisi
    if (!nilai || !dari || !ke) {
      throw new BadRequestException(
        'nilai, dari, dan ke wajib diisi',
      );
    }

    const angka = Number(nilai);

    if (Number.isNaN(angka)) {
      throw new BadRequestException(
        'nilai harus berupa angka',
      );
    }

    const satuan = [
      'celsius',
      'fahrenheit',
      'kelvin',
    ];

    if (
      !satuan.includes(dari) ||
      !satuan.includes(ke)
    ) {
      throw new BadRequestException(
        'dari dan ke hanya boleh celsius, fahrenheit, atau kelvin',
      );
    }

    if (dari === 'kelvin' && angka < 0) {
      throw new BadRequestException(
        'nilai kelvin tidak boleh kurang dari 0',
      );
    }

    return this.appService.konversiSuhu(
      angka,
      dari,
      ke,
    );
  }

 
  // SOAL 3 - GENERATOR DERET
 

  @Get('deret/:jenis')
  generatorDeret(
    @Param('jenis') jenis: string,
    @Query('jumlah') jumlah: string,
  ) {
    const jenisValid = [
      'ganjil',
      'genap',
      'kuadrat',
    ];

    if (!jenisValid.includes(jenis)) {
      throw new BadRequestException(
        'jenis hanya boleh ganjil, genap, atau kuadrat',
      );
    }

    if (!jumlah) {
      throw new BadRequestException(
        'jumlah wajib diisi',
      );
    }

    const nilaiJumlah = Number(jumlah);

    if (
      Number.isNaN(nilaiJumlah) ||
      !Number.isInteger(nilaiJumlah) ||
      nilaiJumlah < 1 ||
      nilaiJumlah > 20
    ) {
      throw new BadRequestException(
        'jumlah harus bilangan bulat antara 1 sampai 20',
      );
    }

    return this.appService.generatorDeret(
      jenis,
      nilaiJumlah,
    );
  }

  
  // SOAL 4 - NILAI RAPOR


  @Post('nilai/hitung')
  hitungNilaiRapor(@Body() body: any) {
    const {
      nama,
      tugas,
      uts,
      uas,
    } = body;

    if (
      typeof nama !== 'string' ||
      nama.trim() === ''
    ) {
      throw new BadRequestException(
        'nama harus berupa string dan tidak boleh kosong',
      );
    }

    if (
      !Array.isArray(tugas) ||
      tugas.length < 1
    ) {
      throw new BadRequestException(
        'tugas harus array berisi minimal 1 angka',
      );
    }

    for (let i = 0; i < tugas.length; i++) {
      if (
        typeof tugas[i] !== 'number' ||
        tugas[i] < 0 ||
        tugas[i] > 100
      ) {
        throw new BadRequestException(
          `nilai tugas ke-${i + 1} harus angka antara 0 sampai 100`,
        );
      }
    }

    if (
      typeof uts !== 'number' ||
      uts < 0 ||
      uts > 100
    ) {
      throw new BadRequestException(
        'uts harus angka antara 0 sampai 100',
      );
    }

    if (
      typeof uas !== 'number' ||
      uas < 0 ||
      uas > 100
    ) {
      throw new BadRequestException(
        'uas harus angka antara 0 sampai 100',
      );
    }

    return this.appService.hitungNilaiRapor(
      nama,
      tugas,
      uts,
      uas,
    );
  }

  
  // SOAL 5 - KASIR TOKO
 

  @Post('kasir/checkout/:member')
  hitungKasir(
    @Param('member') member: string,
    @Query('metode') metode: string,
    @Body() body: any,
  ) {
    const memberLower = member.toLowerCase();
    const metodeLower = metode?.toLowerCase();

    const memberValid = [
      'reguler',
      'silver',
      'gold',
    ];

    if (!memberValid.includes(memberLower)) {
      throw new BadRequestException(
        'member hanya boleh reguler, silver, atau gold',
      );
    }

    if (
      !metodeLower ||
      !['tunai', 'qris'].includes(metodeLower)
    ) {
      throw new BadRequestException(
        'metode hanya boleh tunai atau qris',
      );
    }

    const { items } = body;

    if (
      !Array.isArray(items) ||
      items.length < 1 ||
      items.length > 10
    ) {
      throw new BadRequestException(
        'items harus array, tidak kosong, dan maksimal 10 item',
      );
    }

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const nomorItem = i + 1;

      if (
        typeof item.nama !== 'string' ||
        item.nama.trim() === ''
      ) {
        throw new BadRequestException(
          `Item ke-${nomorItem}: nama harus string dan tidak kosong`,
        );
      }

      if (
        typeof item.harga !== 'number' ||
        item.harga <= 0
      ) {
        throw new BadRequestException(
          `Item ke-${nomorItem}: harga harus angka lebih dari 0`,
        );
      }

      if (
        typeof item.qty !== 'number' ||
        !Number.isInteger(item.qty) ||
        item.qty <= 0
      ) {
        throw new BadRequestException(
          `Item ke-${nomorItem}: qty harus bilangan bulat lebih dari 0`,
        );
      }
    }

    return this.appService.hitungKasir(
      memberLower,
      metodeLower,
      items,
    );
  }
}