class CatchReportService {
  static reports = []; // In-memory storage for demo

  static async submitReport(reportData) {
    try {
      const report = {
        id: `report_${Date.now()}`,
        timestamp: new Date().toISOString(),
        ...reportData,
        status: "submitted",
      };

      // Validate report data
      this.validateReport(report);

      // Add to reports array (in production, this would be a database)
      this.reports.push(report);

      return {
        success: true,
        reportId: report.id,
        message: "Catch report submitted successfully",
        report,
      };
    } catch (error) {
      console.error("Error submitting catch report:", error);
      throw error;
    }
  }

  static validateReport(report) {
    const requiredFields = ["species", "location", "length", "weight"];
    for (const field of requiredFields) {
      if (!report[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Validate measurements
    if (isNaN(report.length) || report.length <= 0) {
      throw new Error("Invalid length measurement");
    }
    if (isNaN(report.weight) || report.weight <= 0) {
      throw new Error("Invalid weight measurement");
    }
  }

  static async getReport(reportId) {
    const report = this.reports.find((r) => r.id === reportId);
    if (!report) {
      throw new Error("Report not found");
    }
    return report;
  }

  static async getUserReports(userId) {
    return this.reports.filter((report) => report.userId === userId);
  }

  static async getLocationReports(locationId, startDate, endDate) {
    return this.reports.filter((report) => {
      const reportDate = new Date(report.timestamp);
      return (
        report.location === locationId &&
        (!startDate || reportDate >= new Date(startDate)) &&
        (!endDate || reportDate <= new Date(endDate))
      );
    });
  }

  static async getLocationStats(locationId) {
    const locationReports = this.reports.filter(
      (report) => report.location === locationId,
    );

    return {
      totalCatches: locationReports.length,
      speciesCounts: this.countSpecies(locationReports),
      averageSizes: this.calculateAverageSizes(locationReports),
      bestTimes: this.analyzeBestTimes(locationReports),
    };
  }

  static countSpecies(reports) {
    return reports.reduce((counts, report) => {
      counts[report.species] = (counts[report.species] || 0) + 1;
      return counts;
    }, {});
  }

  static calculateAverageSizes(reports) {
    const sizesBySpecies = {};
    reports.forEach((report) => {
      if (!sizesBySpecies[report.species]) {
        sizesBySpecies[report.species] = {
          lengths: [],
          weights: [],
        };
      }
      sizesBySpecies[report.species].lengths.push(report.length);
      sizesBySpecies[report.species].weights.push(report.weight);
    });

    return Object.entries(sizesBySpecies).reduce(
      (averages, [species, sizes]) => {
        averages[species] = {
          averageLength: this.calculateAverage(sizes.lengths),
          averageWeight: this.calculateAverage(sizes.weights),
        };
        return averages;
      },
      {},
    );
  }

  static calculateAverage(numbers) {
    return numbers.length > 0
      ? (numbers.reduce((sum, num) => sum + num, 0) / numbers.length).toFixed(2)
      : 0;
  }

  static analyzeBestTimes(reports) {
    const catches = reports.map((report) => {
      const date = new Date(report.timestamp);
      return {
        hour: date.getHours(),
        success: true, // Could be based on size/weight thresholds
      };
    });

    const hourlySuccess = Array(24)
      .fill(0)
      .map((_, hour) => {
        const hourCatches = catches.filter((c) => c.hour === hour);
        return {
          hour,
          success: hourCatches.filter((c) => c.success).length,
          total: hourCatches.length,
        };
      });

    return hourlySuccess
      .filter((h) => h.total > 0)
      .sort((a, b) => b.success / b.total - a.success / a.total)
      .slice(0, 3)
      .map((h) => ({
        hour: h.hour,
        successRate: ((h.success / h.total) * 100).toFixed(1) + "%",
      }));
  }
}

module.exports = CatchReportService;