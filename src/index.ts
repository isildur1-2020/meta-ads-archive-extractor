import "dotenv/config";
import { MongoDB } from "./config/MongoDB";
import { metaExtractorConfig } from "./config/metaScrapper";
import { Logger } from "./lib/logs";
import { MetaExtractor } from "./scrapper/MetaExtractor";
import { CompanyService } from "./services/CompanyService";
import { MetaScrapper } from "./scrapper/MetaScrapper";
import { MetaCookies } from "./scrapper/MetaCookies";
import { ScrapperPersister } from "./scrapper/ScrapperPersister";
import { Company } from "./models/Company";

const main = async () => {
  try {
    await MongoDB.connect();
    await Company.updateMany({ was_used: true });
    console.log("Nice");
    return;
    const metaScrapper = new MetaExtractor(
      metaExtractorConfig,
      new ScrapperPersister(
        new CompanyService(),
        new MetaScrapper(new MetaCookies()),
        metaExtractorConfig.search_terms
      )
    );
    await metaScrapper.getAdsArchive();
  } catch (err: any) {
    Logger.printErrMsg(err);
  }
};

main();
