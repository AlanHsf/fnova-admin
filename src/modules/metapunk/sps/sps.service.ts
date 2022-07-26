import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SpsService {
  public guild:any = {}
  public players:any = []
  public guildPlayers:any = []

  baseurl:any = "https://test.fmode.cn/";

  constructor(
    private http: HttpClient,
  ) {
    let nserver = localStorage.getItem("NOVA_SERVERURL");
    if(nserver&&nserver.startsWith("http")){
      this.baseurl = nserver
    }
  }

  /**** 公会数据加载区域
   * 
   */
  gLoading = false;
  guilds:any = [];
  cards:any = [];
  async loadGuilds(options:any={}){
    this.gLoading = true;
    options.limit = options.limit||50
    options.offset = options.offset||0
    options.orderBy = options.orderBy||'total'
    options.orderAsc = options.offset||'DESC'

    let sql = `SELECT 
          case when "guild" is not null then "guild" else '暂无公会' end as "guild",
          MAX("logo"),MAX("pin") as "pin",
          MAX("desc"),
          case when MAX("name") is not null then MAX("name") else '暂无公会' end as "name",
          SUM(1) as total,
          SUM("power") as power,
          SUM("rating") as rating,
          SUM((case when "quest"='done' and "next" > now() then 1 else 0 end)::numeric) as done,
            SUM((case when "quest"='undone' or ("quest"='done' and  "next" <= now() ) then 1 else 0 end)::numeric) as undone,
           (100 * SUM((case when "quest"='done' and "next" > now() then 1 else 0 end)::numeric) / SUM(1))::integer as progress
                from (SELECT
                    "SPSAccount"."objectId" as key,
                    "MetaGuild"."password" as "pin","guild",
              "MetaGuild"."name" as name,
              "MetaGuild"."desc" as desc,
              "MetaGuild"."logo" as logo,
                    (case when "player"->'rating' is not null then "player"->>'rating' else '0' end)::numeric as "rating",
                    (case when "player"->'collection_power' is not null then "player"->>'collection_power' else '0' end)::numeric as "power",
                    'warn' as status,
                    (case when "player"->'quest'->>'claim_trx_id' is not null then 'done' else 'undone' end) as quest,
                    (case when "player"->'quest'->>'created_date' is not null then ("player"->'quest'->>'created_date')::timestamp + interval '24hour' + interval '8hour' else now() end) as "next"
                FROM "SPSAccount"
                LEFT JOIN "MetaGuild" ON "SPSAccount"."guild"="MetaGuild"."objectId"
            ) accts
        GROUP BY "guild"
        ORDER BY "${options.orderBy}" ${options.orderAsc}
    `;
    this.guilds = await this.novaSelect(sql);
    this.gLoading = false;
  }


  async guildAuth(key,pin,type="total"){
    return new Promise((resolve,reject)=>{
      this.http.post(this.baseurl+"api/metapunk/sps/guildcheck", {key:key,pin:pin,type:type}).subscribe(res => {
        let data:any = res
        data = data&&data.data || {}
        this.guild = data;
        resolve(data)
      },err=>{
        reject(err)
      })
    })
  }


  /**** 玩家数据加载区域
   * 
   */

  pTotal = 0;
  pDone = 0;
  pUndone = 0;
  pLoading = false;
  async loadPlayers(options:any={}){
    this.pLoading = true;
    options.limit = options.limit||50
    options.offset = options.offset||0
    options.orderBy = options.orderBy||'rating'
    options.orderAsc = options.offset||'DESC'
    let guildWhere = options.guild?` WHERE "guild"='${options.guild}'`:``
    if(options.guild=='暂无公会'){
      guildWhere = ` WHERE "guild" is null`
    }

    let sql = `SELECT *,
    (case when "quest"='done' and "next" > now() then true else false end) as complete 
 FROM (
   SELECT 
      "objectId" as key,"username","mail",
      "pin","guild",
      (case when "player"->'rating' is not null then "player"->>'rating' else '0' end)::numeric as "rating",
      (case when "player"->'collection_power' is not null then "player"->>'collection_power' else '0' end)::numeric as "power",
      'warn' as status,
      (case when "player"->'quest'->>'claim_trx_id' is not null then 'done' else 'undone' end) as "quest",
      (case when "player"->'quest'->>'created_date' is not null then ("player"->'quest'->>'created_date')::timestamp + interval '24hour' + interval '8hour' else now() end) as "next"
    FROM "SPSAccount"
    ${guildWhere}
    ORDER BY "${options.orderBy}" ${options.orderAsc} 
    ) as pl`;

    let countSql = `SELECT 
                count(*)::numeric as total,
                count(case when "quest"='done' and "next" > now() then 1 else null end)::numeric as done,
                count(case when "quest"='undone' or ("quest"='done' and  "next" <= now() ) then 1 else null end)::numeric as undone
        from (SELECT
            "objectId" as key,
            "pin",
            (case when "player"->'rating' is not null then "player"->>'rating' else '0' end) as "rating",
            (case when "player"->'collection_power' is not null then "player"->>'collection_power' else '0' end) as "power",
            'warn' as status,
            (case when "player"->'quest'->>'claim_trx_id' is not null then 'done' else 'undone' end) as quest,
            (case when "player"->'quest'->>'created_date' is not null then ("player"->'quest'->>'created_date')::timestamp + interval '24hour' + interval '8hour' else now() end) as "next"
        FROM "SPSAccount") accts
    `;
    let countData = await this.novaSelect(countSql);
    this.pTotal = countData[0].total;
    this.pDone = countData[0].done;
    this.pUndone = countData[0].undone;
    sql = sql + ` LIMIT ${options.limit} OFFSET ${options.offset}`;
    let players = await this.novaSelect(sql);
    this.pLoading = false;
    return players
  }

  novaSelect(sql,params?){
    let options:any = {sql:sql}
    if(params){
      options.params = params
    }
    return new Promise((resolve,reject)=>{
      this.http.post(this.baseurl+"api/novaql/select", options).subscribe(res => {
        let data:any = res
        resolve(data.data)
      },error=>{
        reject(error)
      })
    })
  }

  loadGuildPlayers(guild?,refresh=false){
    return new Promise((resolve,reject)=>{

    guild = guild&&guild.id || guild || this.guild&&this.guild.id

    if(!refresh){
      if(this.players.length>0){return}
    }
    if(!guild){return []}
    let sql = `SELECT *,
        (case when "quest"='done' and "next" > now() then true else false end) as complete 
     FROM (
      SELECT 
      "objectId","username","mail","guild"
      (case when "player"->'rating' is not null then "player"->>'rating' else '0' end)::numeric as "rating",
      (case when "player"->'collection_power' is not null then "player"->>'collection_power' else '0' end)::numeric as "power",
      (case when "player"->'quest'->>'claim_trx_id' is not null then 'done' else 'undone' end) as "quest",
      (case when "player"->'quest'->>'created_date' is not null then ("player"->'quest'->>'created_date')::timestamp + interval '24hour' + interval '8hour' else now() end) as "next"
      FROM "SPSAccount"
      WHERE "guild"='${guild}'
      ORDER BY "rating" DESC
      LIMIT 300
    ) as pl;`
    this.http.post(this.baseurl+"api/novaql/select", {sql: sql}).subscribe(res => {
        let data:any = res
        resolve(data.data || []);
      },err=>{
        console.error(err)
        resolve([])
      })
    })

  }

  async getMainnetStats(duration="24h"){

    return new Promise((resolve,reject)=>{
      this.http.post(this.baseurl+"api/metapunk/radar/stats", {type: "games",name:"splinterlands",duration:"24h",format:"statistic"}).subscribe(res => {
        let data:any = res
        resolve(data.data)
      })
      return
    })
  }

  /*********************
   * 卡牌数据加载
   */

  async loadAllCards(){
      if(this.cards&&this.cards.length>0){
        return this.cards
      }

      return new Promise((resolve,reject)=>{
        this.http.post(this.baseurl+"api/metapunk/sps/cards", {}).subscribe(res => {
          let data:any = res
          data = data&&data.data || {}
          this.cards = data;
          resolve(data)
        },err=>{
          reject(err)
        })
      })
      
  }

}
