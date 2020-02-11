import { mapGetters } from 'vuex'
import { Kassa, Klient, Obespechenie } from './imports'
import { moment } from '@/functions'

export default {
components: { Kassa, Klient, Obespechenie },
watch: {
    date(v) {
        const { date } = this.bilet
        if (date && !moment(date).isSameOrBefore(v, 'date')) this.update({})
    },
    bilet({ _id, number }) {
        if (_id && !number) this.update({})
        
    }
},
data () {
    return {
        klient: {},
        bilet: {},
        obespechenie: [{}],
        type: 'gold'

    }
},
computed: {
    ...mapGetters({
        klientMap: 'klient/map',
        reestrMap: 'reestr/map',
        used: 'reestr/used',
        date: 'date'
    })
},
methods: {
    saveKlient(v) {
        return this.$refs['klient'].save(v)
    },
    saveBilet(v) {
        return this.$refs['kassa'].save(v)
    },
    select(v) {
        this.$refs['kassa'].select(v._id)
        return this.update({})
    },
    update(v) {
        const { klient, passport, obespechenie, type } = this.bilet = { ...v }        
        this.klient = { ...this.klientMap[klient], passport }
        this.type = type || 'gold'
        this.obespechenie = obespechenie || [ {} ]
    },
    changeType(v) {
        this.type = !v ? 'gold' : 'things'
    },
    onCopy(id) {
        const  bilet = { ...this.reestrMap[id] }
        const ref = this.reestrMap[bilet.ref]
        const { klient, passport, obespechenie, ocenca, days, discount, type } = ref || bilet
        this.update({ klient, passport, obespechenie, ocenca, days, discount, type })
    },
    t(v) {
        return this.$t(v)
    }
}
}